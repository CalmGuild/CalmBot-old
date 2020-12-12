import { Message } from "discord.js";
import DiscordClient from"../structures/Client";

module.exports = async function message(client: DiscordClient, message: Message) {
  if (message.author.bot) return;
  if (!message.guild.id) return;

  if (!message.content.startsWith(client.prefix)) return;

  const args = message.content.slice(client.prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if (cmd) {
    cmd.run(client, message, args);
  }
};
