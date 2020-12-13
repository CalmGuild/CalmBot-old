import { Message } from "discord.js";
import DiscordClient from "../structures/Client";
import GuildSettings from "../schemas/GuildSettings";
import { resolveTypeReferenceDirective } from "typescript";
module.exports = async function message(client: DiscordClient, message: Message) {
  if (message.author.bot) return;
  if (message.guild === null) return;
  if (!message.guild.id) return;

  if (!message.content.startsWith(client.prefix)) return;

  let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });
  if (guildSettings === null) {
    if (message.guild === null) {
      return message.channel.send("Oh crap! An internal error occured while trying to run that command. Please re-enter the command!");
    }
    const doc = new GuildSettings({ guildID: message.guild.id });
    await doc.save();
    guildSettings = doc;
  }

  const args = message.content.slice(client.prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if (cmd) {
    if (guildSettings.disabledCommands.includes(cmd.name)) return;
    if (cmd.name !== "admin" && guildSettings.sleep) return message.channel.send("Bot is in sleep mode! Do c!admin sleep to turn it back on!");
    cmd.run(client, message, args);
  }
};
