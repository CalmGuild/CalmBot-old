import { Message, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import channels from "../../data/calm/channels.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function VouchCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    let commandsChannel: TextChannel, infoChannel: TextChannel;

    if (message.guild?.id === "501501905508237312") {
      commandsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.COMMUNITY.COMMANDS.id) as TextChannel;
      infoChannel = message.guild.channels.cache.find((chan) => chan.id === channels.UPON_JOINING.INFO.id) as TextChannel;
    } else {
      commandsChannel = message.guild?.channels.cache.find((chan) => chan.name === channels.COMMUNITY.COMMANDS.name) as TextChannel;
      infoChannel = message.guild?.channels.cache.find((chan) => chan.name === channels.UPON_JOINING.INFO.name) as TextChannel;
    }
    if (!commandsChannel || !infoChannel) {
      message.reply("We could not find the commands / info channel!");
      return;
    }

    const vouchSystem =
      "**Vouch System**\n" +
      "To be eligible to vouch a member in Calm, you must be Noble+.\n" +
      `To be vouched into Calm, you must meet the vouch requirements as stated in ${infoChannel}\n\n` +
      "Each rank below gets the number of vouches listed PER MONTH.\n\n" +
      "Noble: 3\nLoyal: 4\nElites: 5\nOG: 6\nGuild Staff: 7\n\n" +
      `*If you have any questions, please do \`t!open\` in ${commandsChannel} to open a ticket and talk to staff*`;

    message.channel.send(vouchSystem);
  };
  return {
    run: run,
    settings: {
      description: "Explains our vouching system",
      usage: "vouch",
      guildOnly: true,
    },
  };
}

export default VouchCommand();
