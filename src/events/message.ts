import { Message } from "discord.js";
import DiscordClient from "../structures/Client";
import Database from "../utils/database/Database";

export default async function message(client: DiscordClient, message: Message) {
  if (message.author.bot) return;

  const prompt = client.promptListeners.find((p) => p.channel === message.channel.id && p.user === message.author.id);
  if (prompt) {
    client.promptListeners = client.promptListeners.filter((ele) => {
      ele !== prompt;
    });

    if (message.content.toLowerCase() === "exit") {
      message.channel.send("Exited.");
      return;
    }

    prompt.callback(message);
    return;
  }

  if (!message.content.toLowerCase().startsWith(client.prefix)) return;

  const args: string[] = message.content.slice(client.prefix.length).trim().split(/ +/g);
  const commandName = args.shift()!.toLowerCase();

  if (message.guild) {
    const settings = await Database.getGuildSettings(message.guild.id); // gen guild settings
    const tag = settings.tags.find((t) => t.name === commandName);
    if (tag) {
      message.channel.send(tag.response);
      return;
    }
  }

  let command: any = client.commands.get(commandName);
  if (command) {
    client.executeCommand(command, message, args);
  }
}
