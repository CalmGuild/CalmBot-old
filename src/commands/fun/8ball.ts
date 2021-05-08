import { Message, MessageEmbed } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";

const responses = [
  "It is certain",
  "Processing... I don't care",
  "It is decidedly so",
  "Without a doubt",
  "Yes definitely",
  "Error: 400. Question too stupid",
  "You may rely on it",
  "Im not answering that",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "No",
  "Signs point to yes",
  "Reply hazy try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "This is a perfect discord bot and I can not waste my time with that question",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "what??",
  "Very doubtful",
  "I don't feel like answering that, continue on with your day",
];

function EightBallCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const _8ball = new MessageEmbed().setTitle(`🎱 ${responses[Math.floor(Math.random() * responses.length + 0)]}`).setColor("#007FFF");
    message.channel.send(_8ball);
  };

  return {
    run: run,
    settings: {
      description: "Ask the magical 8ball a question",
      usage: "8ball <question>",
      guildOnly: false,
      minimumArgs: 1,
    },
  };
}

export default EightBallCommand();
