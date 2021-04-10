import { Message, TextChannel } from "discord.js";
import DiscordClient from "../structures/Client";
import Database from "../utils/database/Database";

export default async function message(client: DiscordClient, message: Message) {
  if (message.author.bot) return;

  if (!message.content.toLowerCase().startsWith(client.prefix)) return;

  if (message.guild) {
    await Database.getGuildSettings(message.guild.id); // gen guild settings
  }

  const args: string[] = message.content.slice(client.prefix.length).trim().split(/ +/g);

  const commandName = args.shift()!.toLowerCase();

  let command: any = client.commands.get(commandName);
  if (command) {
    client.executeCommand(command, message, args);
  }
}
