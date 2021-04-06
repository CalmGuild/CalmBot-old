import { Message, MessageEmbed } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function RemoveCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
    let guildSettings = await Database.getGuildSettings(message.guild.id);

    const verbal = guildSettings.verbals.find((element) => element.casenumber === Number.parseInt(args[0] as string));
    if (!verbal) {
      message.channel.send(`Could not find verbal warning with case id ${args[0]}`);
      return;
    }

    guildSettings.verbals = arrayRemove(guildSettings.verbals, verbal);
    guildSettings.save();

    const embed = new MessageEmbed().setTitle(`Removed verbal case ${args[0]}`).setColor("#48db8f");
    message.channel.send(embed);
  };

  return {
    run: run,
    settings: {
      description: "Remove a verbal warning from someone",
      usage: "verbal remove <case id>",
      minimumArgs: 1,
    },
  };
}

export default RemoveCommand();

function arrayRemove(arr: any[], value: any) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}
