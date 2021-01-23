import { Message, TextChannel } from "discord.js";
import Client from "../structures/Client";
import channels from "../data/calm/channels.json";

module.exports = {
  name: "roles",
  description: "General information about roles",
  category: "Information",
  usage: "roles",
  run: async function run(client: Client, message: Message) {
    let selfRolesChannel: TextChannel, roleInfo: TextChannel;
    if (message.guild.id === "501501905508237312") {
      selfRolesChannel = message.guild.channels.cache.find((chan) => chan.id === channels.UPON_JOINING.SELF_ASSIGN_ROLES.id) as TextChannel;
      roleInfo = message.guild.channels.cache.find((chan) => chan.id === channels.UPON_JOINING.ROLE_INFO.id) as TextChannel;
    } else {
      selfRolesChannel = message.guild.channels.cache.find((chan) => chan.name === channels.UPON_JOINING.SELF_ASSIGN_ROLES.name) as TextChannel;
      roleInfo = message.guild.channels.cache.find((chan) => chan.name === channels.UPON_JOINING.ROLE_INFO.name) as TextChannel;
    }
    if (!selfRolesChannel || !roleInfo) {
      return message.reply("we could not find the self-assign-roles / role-info channel!");
    }

    message.channel.send(
      `Information on all roles can be found in ${roleInfo}\nYou want some of these roles? Go give yourself some in ${selfRolesChannel}!! <3`
    );
  },
};
