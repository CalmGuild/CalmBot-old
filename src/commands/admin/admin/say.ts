import { Message, TextChannel, VoiceChannel } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import logger from "../../../utils/logger/Logger";

function SayCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!args[0]) return;
    const id = args[0];
    const msg = args.slice(1, args.length).join(" ");

    const channel = message.guild?.channels.cache.get(id);
    if (!channel) {
      message.channel.send("Couldn't find that channel!");
      return;
    }

    if (channel instanceof VoiceChannel) {
      message.channel.send("Only can send messages in text channels!");
    }

    (channel as TextChannel).send(msg).catch((err) => {
      message.channel.send("Error sending message in that channel!");
      logger.error(err);
    });
  };

  return {
    run: run,
    settings: {
      description: "Say a command in a channel as calmbot",
      usage: "admin say <id> <message>",
      minimumArgs: 2,
    },
  };
}

export default SayCommand();
