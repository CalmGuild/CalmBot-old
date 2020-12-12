import { Message } from "discord.js";
import DiscordClient from "../structures/Client";
import GuildSettings from "../schemas/GuildSettings";
module.exports = async function message(client: DiscordClient, message: Message) {
  if ((await GuildSettings.findOne({ guildID: message.guild.id })) === null) {
    const doc = new GuildSettings({ guildID: message.guild.id });
    await doc.save();
  }

  if (message.author.bot) return;
  if (!message.guild.id) return;

  if (!message.content.startsWith(client.prefix)) return;

  const args = message.content.slice(client.prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if (cmd) {
    if ((await GuildSettings.findOne({ guildID: message.guild.id })).disabledCommands.includes(cmd.name)) return;
    cmd.run(client, message, args);
  }
};
