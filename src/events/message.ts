import { Message, TextChannel } from "discord.js";
import { loggers } from "winston";
import DiscordClient from "../structures/Client";
import Database from "../utils/database/Database";
import Logger from "../utils/logger/Logger";
module.exports = async function message(client: DiscordClient, message: Message) {
  if (message.author.bot || message.channel.type === "dm") return;

  // #count-to-x channel code so invalid numbers are deleted and channel name is updated
  let currentChannel = message.channel as TextChannel;
  if (currentChannel.name.startsWith("count-to-")) {
    const messageList = await message.channel.messages.fetch({ limit: 2 });
    const previousMessage = messageList.last();
    const previousCount = parseInt(previousMessage.content, 10);
    const currentCount = parseInt(message.content, 10);

    // Makes sure user does not send message twice in a row
    if (message.author.tag === previousMessage.author.tag) {
      return message.delete();
    }

    // Checks if it is correct number OR if the message is not a number at all
    if (currentCount != previousCount + 1) {
      return message.delete();
    }

    // Checks if count is divisible by 1000, if so changes the channel name to #count-to-(current count + 1000)
    if (currentCount % 1000 === 0) {
      return currentChannel.setName(`count-to-${Math.floor((currentCount + 1000) / 1000)}k`);
    }
  } // End count-to code.

  if (!message.content.toLowerCase().startsWith(client.prefix)) return;

  let guildSettings = await Database.getGuildSettings(message.guild.id);

  const args = message.content.slice(client.prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

  let cmd: any = client.commands.get(command);
  if (!cmd) {
    cmd = client.aliases.get(command);
  }
  if (!cmd) return;
  if (cmd) {
    if (guildSettings.disabledCommands.includes(cmd.name)) return;
    if (cmd.name !== "admin" && guildSettings.sleep) return message.channel.send("Bot is in sleep mode! Do c!admin sleep to turn it back on!");

    // Temporary disable of all commands in Calm #general Channel
    if (message.guild.id === "501501905508237312" && message.channel.id === "501501905508237315") {
      return;
    }
    if (cmd.permissions) {
      let missingPerms = [];
      missingPerms = cmd.permissions.filter((permission) => !message.member.hasPermission(permission));
      if (missingPerms.length) return message.channel.send(`You are missing the following permissions required to run this command: ${missingPerms.map((x) => `\`${x}\``).join(", ")}`);
    }
    Logger.verbose(`Running the ${cmd.name} commands for ${message.author.id}`);
    cmd.run(client, message, args);
  }
};
