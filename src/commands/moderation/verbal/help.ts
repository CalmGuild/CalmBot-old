import { Message, MessageEmbed } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import logger from "../../../utils/logger/Logger";

function HelpCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const verbalcommand = client.commands.get("verbal");
    if (!verbalcommand) {
      message.channel.send("Error getting verbal subcommand list!");
      return;
    }

    const embed = new MessageEmbed().setTitle("Verbal commands menu").setColor("#17c1eb");
    for (const [, command] of verbalcommand.subCommands!) {
      embed.addField(client.prefix + command.settings?.usage, command.settings?.description);
    }
    message.channel.send(embed).catch((e) => {
      logger.warn(e);
    });
  };

  return {
    run: run,
    settings: {
      description: "Shows all verbal commands",
      usage: "verbal help",
    },
  };
}

export default HelpCommand();
