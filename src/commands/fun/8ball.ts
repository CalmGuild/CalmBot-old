import { Message, MessageEmbed } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";

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
