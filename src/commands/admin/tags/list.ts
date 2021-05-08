import { Message, MessageEmbed } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function ListCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!!.id);

    if (settings.tags.length === 0) {
      message.channel.send(`No tags exist. Do ${client.prefix}tags create <name> to create one!`);
      return;
    }

    let desc = "```\n";
    settings.tags.forEach((tag) => (desc += client.prefix + tag.name + "\n"));
    desc += "```";
    const embed = new MessageEmbed().setTitle("Tag list").setDescription(desc);
    message.channel.send(embed);
  };

  return {
    run: run,
    settings: {
      description: "Lists all tags",
      usage: "tags list",
    },
  };
}

export default ListCommand();
