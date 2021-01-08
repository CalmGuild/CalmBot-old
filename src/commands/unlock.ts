import { Message, Role, TextChannel } from "discord.js";
import Client from "../structures/Client";
import channels from "../data/calm/channels.json";

module.exports = {
  name: "unlock",
  description: "Unlocks the server",
  category: "Admin",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    // Check for ADMINISTRATOR permission
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply("You are missing the `ADMINISTRATOR` permission.");
    }
    // Check if full lockdown, or just a normal one.
    let fullLock: boolean;
    if (args[0] == "full") {
      message.channel.send("Unlocking Public + Guild Channels!");
      fullLock = true;
    } else {
      message.channel.send("Unlocking Public Channels!");
      fullLock = false;
    }

    // Gets the Guild Member Role, Nitro booster role, and the news channel.
    let guildMemberRole: Role, nitroBoosterRole: Role, newsChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      guildMemberRole = message.guild.roles.cache.get("501504002853306388");
      nitroBoosterRole = message.guild.roles.cache.get("501504002853306388");
      newsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.IMPORTANT.NEWS.id) as TextChannel;
    } else {
      guildMemberRole = message.guild.roles.cache.find((role) => role.name === "Calmies");
      nitroBoosterRole = message.guild.roles.cache.find((role) => role.name === "Nitro Booster");
      newsChannel = message.guild.channels.cache.find((chan) => chan.name === channels.IMPORTANT.NEWS.name) as TextChannel;
    }

    if (newsChannel) {
      newsChannel.send(`**Attention,** \n<@${message.author.id}> has **unlocked** the server! \nYou are **now free to chat**!`);
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
          console.log(`Channel ${channelProperties.name} wasn't found`);
        } else if (channelProperties.membersOnly && fullLock) {
          channel.updateOverwrite(guildMemberRole, { SEND_MESSAGES: true, ADD_REACTIONS: null });
        } else if (channelProperties.public && fullLock) {
          switch (categoryName) {
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
          switch (categoryName) {
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
  },
};
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
