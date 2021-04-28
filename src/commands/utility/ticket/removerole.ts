import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function RemoveRoleCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!.id);
    const roleid = args[0]!;

    const role = message.guild?.roles.cache.get(roleid);
    if (!role) {
      message.channel.send(`Could not find that role! Did you copy the id right?`);
      return;
    }

    if (!settings.ticketRoles.includes(roleid)) {
      message.channel.send(`Role is not added! Do ${client.prefix}ticket addrole <role-id> to add it`);
      return;
    }

    settings.ticketRoles = settings.ticketRoles.filter((ele) => ele != roleid);
    settings.save();
    message.reply(`Removed ${role.name}`);
  };

  return {
    run: run,
    settings: {
      description: "Removes a role from the list of roles to gain access to tickets",
      usage: "ticket removerole <role-id>",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN,
    },
  };
}

export default RemoveRoleCommand();
