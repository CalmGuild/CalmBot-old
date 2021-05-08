import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function DeleteCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!!.id);

    const tagname = args[0]!!.toLowerCase();
    if (!settings.tags.find((tag) => tag.name === tagname)) {
      message.channel.send(`A tag by that name doesn't exists! Please do c!tags create ${tagname}`);
      return;
    }

    const tag = settings.tags.find(t => t.name === tagname);
    settings.tags = settings.tags.filter((ele) => ele !== tag);
    settings.save();
    message.channel.send(`Deleted ${tagname}`);
  };

  return {
    run: run,
    settings: {
      description: "Deletes a tag",
      usage: "tags delete <name>",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN,
    },
  };
}

export default DeleteCommand();
