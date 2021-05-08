import { Message, TextChannel } from "discord.js";
import Client from "../structures/Client";

export default async function messageUpdate(client: Client, oldMessage: Message, newMessage: Message) {
  let currentChannel = oldMessage.channel as TextChannel;
  // compromise that prevents one person from breaking the entire channel without it being possible for the bot to ruin anything
  if (currentChannel.name.startsWith("count-to-")) {
    const messageList = await newMessage.channel.messages.fetch({ limit: 1 });
    const lastMessage = messageList.first();

    if (newMessage === lastMessage) {
      newMessage.delete();
    }
  }
};
