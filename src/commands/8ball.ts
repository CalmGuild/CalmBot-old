import { Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";

const responses = [
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",
  "Reply hazy try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful",
];

module.exports = {
  name: "8ball",
  description: "Ask the Magic 8Ball a question",
  category: "Fun",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    if (args.length === 0) {
      message.channel.send("Please ask a question!");
      return;
    }
    const _8ball = new MessageEmbed().setTitle(`🎱 ${responses[Math.floor(Math.random() * responses.length + 0)]}`).setColor("#007FFF");
    message.channel.send(_8ball);
  },
};
