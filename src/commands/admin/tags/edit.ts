import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function EditCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!!.id);

    const tagname = args[0]!!.toLowerCase();
    if (!settings.tags.find((tag) => tag.name === tagname)) {
      message.channel.send(`A tag by that name doesn't exists! Please do c!tags create ${tagname}`);
      return;
    }

    client.addPromptListener(`Please enter the new text for ${tagname}`, message.channel, message.author.id, 15, (response) => {
      settings.tags = settings.tags.filter((ele) => ele.name !== tagname);
      settings.tags.push({
        name: tagname,
        response: response.content,
      });
      settings.save();
      message.channel.send(`Edited ${tagname}`);
    });
  };

  return {
    run: run,
    settings: {
      description: "Edits an already existing tag",
      usage: "tags edit <name>",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN,
    },
  };
}

export default EditCommand();
