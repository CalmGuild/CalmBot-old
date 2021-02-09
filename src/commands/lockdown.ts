import { Message, Role, TextChannel } from "discord.js";
import Client from "../structures/Client";
import channels from "../data/calm/channels.json";
import roles from "../data/calm/roles.json";
import logger from "../utils/logger/Logger";
import Permission from "../utils/Permissions/Permission";

module.exports = {
  name: "lockdown",
  description: "Locks down the server",
  category: "Administration",
  usage: "lockdown [full]",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    if(!await Permission.isAdmin(message.member)) return message.channel.send("Missing permissions!");
    
    // Check if full lockdown, or just a normal one.
    let fullLock: boolean;
    if (args[0] == "full") {
      message.channel.send("Initiating **Full** Server Lockdown... All channels will be locked until you run `c!unlock`");
      fullLock = true;
    } else {
      message.channel.send("Initiating Server Lockdown... All public channels will be locked until you run `c!unlock`");
      fullLock = false;
    }

    // Gets the Guild Member Role, Nitro booster role, and the news channel.
    let guildMemberRole: Role, nitroBoosterRole: Role, newsChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      guildMemberRole = message.guild.roles.cache.get(roles.GENERAL.CALMIES.id);
      nitroBoosterRole = message.guild.roles.cache.get(roles.GENERAL.NITRO_BOOSTER.id);
      newsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.IMPORTANT.NEWS.id) as TextChannel;
    } else {
      guildMemberRole = message.guild.roles.cache.find((role) => role.name === roles.GENERAL.CALMIES.name);
      nitroBoosterRole = message.guild.roles.cache.find((role) => role.name === roles.GENERAL.NITRO_BOOSTER.name);
      newsChannel = message.guild.channels.cache.find((chan) => chan.name === channels.IMPORTANT.NEWS.name) as TextChannel;
    }

    if (guildMemberRole === undefined || nitroBoosterRole === undefined) {
      return message.channel.send("Unable to find one or more roles. Please make sure the Guild Member role exists and the Nitro Booster role exists");
    }

    if (newsChannel) {
      await newsChannel.send(`**Attention,** \n<@${message.author.id}> has **initiated** a _server lockdown_. \nYou are **not muted**, but will not be able to talk until a server admin does \`c!unlock\``);
    }

    for (const categoryName in channels) {
      for (const channelName in channels[categoryName]) {
        const channelProperties = channels[categoryName][channelName];

        let channel: TextChannel;
        if (message.guild.id === "501501905508237312") {
          channel = message.guild.channels.cache.find((chan) => chan.id === channelProperties.id) as TextChannel;
        } else {
          channel = message.guild.channels.cache.find((chan) => chan.name === channelProperties.name) as TextChannel;
        }

        if (!channel) {
          logger.verbose(`Channel ${channelProperties.name} wasn't found`);
        } else if (channelProperties.membersOnly && fullLock) {
          channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: false, ADD_REACTIONS: false });
        } else if (channelProperties.public && fullLock) {
          switch (categoryName) {
            case "UPON_JOINING":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "IMPORTANT":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "SUGGESTIONS":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "COMMUNITY":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "MISC":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "VOICE":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "EVENTS":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
          } // End Switch
        } else if (channelProperties.public && !fullLock) {
          switch (categoryName) {
            case "UPON_JOINING":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "IMPORTANT":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "SUGGESTIONS":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "COMMUNITY":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "MISC":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "VOICE":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "EVENTS":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
          } // End Switch
        }
      }
    }
  },
};

// Functions to update channel permissions (overwrites)
function normalLockOverwrite(channel: TextChannel, guildMemberRole: Role, nitroBoosterRole: Role) {
  channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false });
  channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: true });
  channel.updateOverwrite(nitroBoosterRole, { SEND_MESSAGES: true });
}

function fullLockOverwrite(channel: TextChannel, guildMemberRole: Role, nitroBoosterRole: Role) {
  channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false });
  channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: false, ADD_REACTIONS: false });
  channel.updateOverwrite(nitroBoosterRole, { SEND_MESSAGES: false, ADD_REACTIONS: false });
}
