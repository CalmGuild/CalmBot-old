import { Message, TextChannel } from "discord.js";
import Client from "../structures/Client";
import channels from "../data/calm/channels.json";

module.exports = {
  name: "birthday",
  description: "Explains how to set your birthday",
  category: "Information",
  run: async function run(client: Client, message: Message) {
    let commandsChannel: TextChannel;

    if (message.guild.id === "501501905508237312") {
      commandsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.COMMUNITY.COMMANDS.id) as TextChannel;
    } else {
      commandsChannel = message.guild.channels.cache.find((chan) => chan.name === channels.COMMUNITY.COMMANDS.name) as TextChannel;
    }
    if (!commandsChannel) {
      return message.reply("we could not find the commands channel!");
    }
    
    message.channel.send(
      `Want a special "Birthday Nerd" role when it's your birthday?????? AWESOME! FOLLOW THE INSTRUCTIONS BELOW!\n\nGo to ${commandsChannel} and execute the command below with your personal bday:\n\nCommand: bb.set (date) [timezone]\n-Example: bb.set oct-21 es\n\nTo find the timezone the bot will accept, click this link and copy the timezone given EXACTLY how it is: https://xske.github.io/tz/`
    );
  },
};
