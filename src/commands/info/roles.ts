import { Message, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import channels from "../../data/calm/channels.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function RolesCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    let selfRolesChannel: TextChannel, roleInfo: TextChannel;
    if (message.guild?.id === "501501905508237312") {
      selfRolesChannel = message.guild.channels.cache.find((chan) => chan.id === channels.UPON_JOINING.SELF_ASSIGN_ROLES.id) as TextChannel;
      roleInfo = message.guild.channels.cache.find((chan) => chan.id === channels.UPON_JOINING.ROLE_INFO.id) as TextChannel;
    } else {
      selfRolesChannel = message.guild?.channels.cache.find((chan) => chan.name === channels.UPON_JOINING.SELF_ASSIGN_ROLES.name) as TextChannel;
      roleInfo = message.guild?.channels.cache.find((chan) => chan.name === channels.UPON_JOINING.ROLE_INFO.name) as TextChannel;
    }
    if (!selfRolesChannel || !roleInfo) {
      message.reply("We could not find the self-assign-roles / role-info channel!");
      return;
    }

    message.channel.send(`Information on all roles can be found in ${roleInfo}\nYou want some of these roles? Go give yourself some in ${selfRolesChannel}!! <3`);
  };

  return {
    run: run,
    settings: {
      description: "General information about roles",
      usage: "roles",
      guildOnly: true,
    },
  };
}

export default RolesCommand();
