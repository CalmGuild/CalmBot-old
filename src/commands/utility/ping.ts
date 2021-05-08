import { Message } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function PingCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    message.channel.send(`Bot latency is \`${Date.now() - message.createdTimestamp}ms\`, Pong!`);
  };

  return {
    run: run,
    settings: {
      description: "Pings the bot!",
      usage: "ping",
    },
  };
}

export default PingCommand();
