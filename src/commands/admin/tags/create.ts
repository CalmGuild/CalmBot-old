import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function CreateCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!!.id);

    const tagname = args[0]!!.toLowerCase();

    if (client.commands.get(tagname)) {
      message.channel.send("There is a command with that name!");
      return;
    }

    if (settings.tags.find((tag) => tag.name === tagname)) {
      message.channel.send(`A tag by that name already exists! Please do c!tags edit ${tagname} or c!tags delete ${tagname}`);
      return;
    }

    client.addPromptListener(`Please enter the text for ${tagname}`, message.channel, message.author.id, 15, (response) => {
      settings.tags.push({
        name: tagname,
        response: response.content,
      });
      settings.save();

      response.channel.send(`Added ${tagname}, do ${client.prefix + tagname} to see it!`);
    });
  };

  return {
    run: run,
    settings: {
      description: "Creates a new tag",
      usage: "tags create <name>",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN,
    },
  };
}

export default CreateCommand();
