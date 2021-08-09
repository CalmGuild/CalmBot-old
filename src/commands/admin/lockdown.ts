import { Message, Role, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import channels from "../../data/calm/channels.json";
import roles from "../../data/calm/roles.json";
import logger from "../../utils/logger/Logger";
import { ICommand, PermissionsEnum, RunCallback } from "../../structures/Interfaces";

function LockdownCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
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
    let guildMemberRole: Role | undefined, nitroBoosterRole: Role | undefined, newsChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      guildMemberRole = message.guild.roles.cache.get(roles.GENERAL.CALMIES.id);
      nitroBoosterRole = message.guild.roles.cache.get(roles.GENERAL.NITRO_BOOSTER.id);
      newsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.IMPORTANT.NEWS.id) as TextChannel;
    } else {
      guildMemberRole = message.guild.roles.cache.find((role) => role.name === roles.GENERAL.CALMIES.name);
      nitroBoosterRole = message.guild.roles.cache.find((role) => role.name === roles.GENERAL.NITRO_BOOSTER.name);
      newsChannel = message.guild.channels.cache.find((chan) => chan.name === channels.IMPORTANT.NEWS.name) as TextChannel;
    }

    if (!guildMemberRole || !nitroBoosterRole) {
      message.channel.send("Unable to find one or more roles. Please make sure the Guild Member role exists and the Nitro Booster role exists");
      return;
    }

    if (newsChannel) {
      await newsChannel.send(`**Attention,** \n<@${message.author.id}> has **initiated** a _server lockdown_. \nYou are **not muted**, but will not be able to talk until a server admin does \`c!unlock\``);
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
          channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: false, ADD_REACTIONS: false });
        } else if (channelProperties.public && fullLock) {
          switch (k) {
            case "UPON_JOINING":
            case "IMPORTANT":
            case "SUGGESTIONS":
            case "COMMUNITY":
            case "MISC":
            case "VOICE":
            case "EVENTS":
              fullLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
          }
        } else if (channelProperties.public && !fullLock) {
          switch (k) {
            case "UPON_JOINING":
            case "IMPORTANT":
            case "SUGGESTIONS":
            case "COMMUNITY":
            case "MISC":
            case "VOICE":
            case "EVENTS":
              normalLockOverwrite(channel, guildMemberRole, nitroBoosterRole);
              break;
          }
        }
      }
    }

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
  };

  return {
    run: run,
    settings: {
      description: "Locksdown the server",
      usage: "lockdown [full]",
      guildOnly: true,
      permissions: PermissionsEnum.ADMIN,
    },
  };
}

export default LockdownCommand();
