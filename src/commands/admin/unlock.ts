import { Message, Role, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import channels from "../../data/calm/channels.json";
import logger from "../../utils/logger/Logger";
import { ICommand, PermissionsEnum, RunCallback } from "../../structures/Interfaces";

function UnlockCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
    let fullLock: boolean;
    if (args[0] == "full") {
      message.channel.send("Unlocking Public + Guild Channels!");
      fullLock = true;
    } else {
      message.channel.send("Unlocking Public Channels!");
      fullLock = false;
    }

    // Gets the Guild Member Role, Nitro booster role, and the news channel.
    let guildMemberRole: Role | undefined, nitroBoosterRole: Role | undefined, newsChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      guildMemberRole = message.guild.roles.cache.get("501504002853306388");
      nitroBoosterRole = message.guild.roles.cache.get("501504002853306388");
      newsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.IMPORTANT.NEWS.id) as TextChannel;
    } else {
      guildMemberRole = message.guild.roles.cache.find((role) => role.name === "Calmies");
      nitroBoosterRole = message.guild.roles.cache.find((role) => role.name === "Nitro Booster");
      newsChannel = message.guild.channels.cache.find((chan) => chan.name === channels.IMPORTANT.NEWS.name) as TextChannel;
    }

    if (!guildMemberRole || !nitroBoosterRole) {
      message.channel.send("Unable to find one or more roles. Please make sure the Guild Member role exists and the Nitro Booster role exists");
      return;
    }


    if (newsChannel) {
      newsChannel.send(`**Attention,** \n<@${message.author.id}> has **unlocked** the server! \nYou are **now free to chat**!`);
    }

    for (const [k, v] of Object.entries(channels)) {
      for (const [, channelProps] of Object.entries(v)) {
        const channelProperties: any = channelProps;

        let channel: TextChannel;
        if (message.guild.id === "501501905508237312") {
          channel = message.guild.channels.cache.find((chan) => chan.id === channelProperties.id) as TextChannel;
        } else {
          channel = message.guild.channels.cache.find((chan) => chan.name === channelProperties.name) as TextChannel;
        }

        if (!channel) {
          logger.verbose(`Channel ${channelProperties.name} wasn't found`);
        } else if (channelProperties.membersOnly && fullLock) {
          channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: true, ADD_REACTIONS: null });
        } else if (channelProperties.public && fullLock) {
          switch (k) {
            case "UPON_JOINING":
              fullUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "IMPORTANT":
              fullUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "COMMUNITY":
              fullUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "SUGGESTIONS":
              channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: null, ADD_REACTIONS: false });
              channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: true, ADD_REACTIONS: false });
              channel.updateOverwrite(nitroBoosterRole, { SEND_MESSAGES: true, ADD_REACTIONS: false });
              break;
            case "MISC":
              fullUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "VOICE":
              fullUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "EVENTS":
              fullUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
          }
        } else if (channelProperties.public && !fullLock) {
          switch (k) {
            case "UPON_JOINING":
              normalUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "IMPORTANT":
              normalUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "COMMUNITY":
              normalUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "SUGGESTIONS":
              channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: null, ADD_REACTIONS: false });
              channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: true });
              channel.updateOverwrite(nitroBoosterRole, { SEND_MESSAGES: true });
              break;
            case "MISC":
              normalUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "VOICE":
              normalUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
            case "EVENTS":
              normalUnlockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
          }
        }
      }
    }
  };

  return {
    run: run,
    settings: {
      description: "Unlocks the server",
      usage: "unlock [full]",
      guildOnly: true,
      permissions: PermissionsEnum.ADMIN,
    },
  };
}

// Functions to update channel permissions (overwrites)
function normalUnlockOverwrite(channel: TextChannel, guildMemberRole: Role, nitroBoosterRole: Role) {
  channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: null, ADD_REACTIONS: null });
  channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: true });
  channel.updateOverwrite(nitroBoosterRole, { SEND_MESSAGES: true });
}

function fullUnlockOverwrite(channel: TextChannel, guildMemberRole: Role, nitroBoosterRole: Role) {
  channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: null, ADD_REACTIONS: null });
  channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: true, ADD_REACTIONS: true });
  channel.updateOverwrite(nitroBoosterRole, { SEND_MESSAGES: true, ADD_REACTIONS: true });
}


export default UnlockCommand();
