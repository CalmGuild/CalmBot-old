import { Message, TextChannel } from "discord.js";
import DiscordClient from "../structures/Client";
import Database from "../utils/database/Database";

export default async function message(client: DiscordClient, message: Message) {
  if (message.author.bot) return;

  // #count-to-x channel code so invalid numbers are deleted and channel name is updated
  let currentChannel = message.channel as TextChannel;
  if (currentChannel.name.startsWith("count-to-")) {
    const messageList = await message.channel.messages.fetch({ limit: 2 });
    const previousMessage = messageList.last();
    if (!previousMessage) return;
    const previousCount = parseInt(previousMessage.content, 10);
    const currentCount = parseInt(message.content, 10);

    // Makes sure user does not send message twice in a row
    if (message.author.tag === previousMessage.author.tag) {
      message.delete();
      return;
    }

    // Checks if it is correct number OR if the message is not a number at all
    if (currentCount != previousCount + 1) {
      message.delete();
      return;
    }

    // Checks if count is divisible by 1000, if so changes the channel name to #count-to-(current count + 1000)
    if (currentCount % 1000 === 0) {
      currentChannel.setName(`count-to-${Math.floor((currentCount + 1000) / 1000)}k`);
      return;
    }
  } // End count-to code.

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
