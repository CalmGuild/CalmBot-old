import { Message, TextChannel } from "discord.js";
import Client from "../structures/Client";
import channels from "../data/calm/channels.json";

module.exports = {
  name: "vouch",
  description: "Explains our vouching system!",
  category: "Information",
  run: async function run(client: Client, message: Message) {
    let commandsChannel: TextChannel;

    if (message.guild.id === "501501905508237312") {
      commandsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.COMMUNITY.COMMANDS.id) as TextChannel;
    } else {
      commandsChannel = message.guild.channels.cache.find(
        (chan) => chan.name === channels.COMMUNITY.COMMANDS.name
      ) as TextChannel;
    }
    if (!commandsChannel) {
      return message.reply("we could not find the commands channel!");
    }

    const vouchSystem =
      "**Vouch System**\n" +
      "To be eligable to vouch a member in Calm, you must be Trusted+.\n" +
      "To be vouched into Calm, you must be no lower than Hypixel level 75.\n\n" +
      "Each rank below gets the number of vouches listed PER MONTH.\n\n" +
      "Trusted: 3\nLoyal: 4\nOG: 5\nGuild Staff: 6\n\n" +
      `*If you have any questions, please do \`t!open\` in ${commandsChannel} to open a ticket and talk to staff*`;

    message.channel.send(vouchSystem);
  },
};
