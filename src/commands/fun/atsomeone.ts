import { Message } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";
import logger from "../../utils/logger/Logger";

let cooldowns: string[] = []

function AtSomeoneCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    
    if (cooldowns.includes(message.author.id)) {
      message.channel.send("This command is on cooldown for one minute!");
      return;
    }

    cooldowns.push(message.author.id);
    setTimeout(() => {
      cooldowns = cooldowns.filter((ele) => ele !== message.author.id);
    }, 60000);
    
    message.guild?.members
      .fetch()
      .then((members) => {
        message.channel.send(`Ping! ${members.random().user}`);
      })
      .catch((err) => logger.error(err));
  };

  return {
    run: run,
    settings: {
      description: "Tag a random user",
      usage: "atsomeone",
      guildOnly: true,
    },
  };
}

export default AtSomeoneCommand();
