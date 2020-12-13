import { Message } from "discord.js";
import DiscordClient from "../structures/Client";
import GuildSettings from "../schemas/GuildSettings";
module.exports = async function message(client: DiscordClient, message: Message) {
  if (message.author.bot) return;
  if (!message.guild.id) return;

  if (!message.content.startsWith(client.prefix)) return;

  let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });
  if (guildSettings === null) {
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
