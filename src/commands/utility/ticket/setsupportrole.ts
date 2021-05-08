import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function SetSupportRoleCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!.id);
    const roleid = args[0]!;
    if (roleid?.toLowerCase() === "remove") {
      settings.ticketSupportedRole = undefined;
      settings.save();
      message.reply("Removed the supported role!");
      return;
    }

    const role = message.guild?.roles.cache.get(roleid);
    if (!role) {
      message.channel.send(`Could not find that role! Do ${client.prefix}ticket settings setsupportrole remove to remove it.`);
      return;
    }

    settings.ticketSupportedRole = roleid;
    settings.save();
    message.reply("Set the role to " + role.name);
  };

  return {
    run: run,
    settings: {
      description: "Set the role to be tagged every time a ticket is created",
      usage: "ticket setsupportrole <role> / remove",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN
    },
  };
}

export default SetSupportRoleCommand();
