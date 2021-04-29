import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function AddRoleCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!.id);
    const roleid = args[0]!;

    const role = message.guild?.roles.cache.get(roleid);
    if (!role) {
      message.channel.send(`Could not find that role! Did you copy the id right?`);
      return;
    }

    if (settings.ticketRoles.includes(roleid)) {
      message.channel.send(`Role is already added! Do ${client.prefix}ticket removerole <role-id> to remove it`);
      return;
    }

    settings.ticketRoles.push(roleid);
    settings.save();
    message.reply(`Added ${role.name}`);
  };

  return {
    run: run,
    settings: {
      description: "Add a role to the list of roles to gain access to tickets",
      usage: "ticket addrole <role-id>",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN,
    },
  };
}

export default AddRoleCommand();
