import { Message, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import channels from "../../data/calm/channels.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function ApplicationCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    let infoChannel: TextChannel;
    if (message.guild?.id === "501501905508237312") {
      infoChannel = message.guild.channels.cache.find((chan) => chan.id === channels.UPON_JOINING.INFO.id) as TextChannel;
    } else {
      infoChannel = message.guild?.channels.cache.find((chan) => chan.name === channels.UPON_JOINING.INFO.name) as TextChannel;
    }
    if (!infoChannel) {
      message.reply("we could not find the info channel!");
      return;
    }
    const send =
      ":green_circle: STATUS: OPEN :green_circle: \n" +
      `If you need the requirements, please head to ${infoChannel} as they are stated there\n\n` +
      "However, they are also on our application below :)\n\n" +
      "**APPLICATION:** <https://forms.gle/tLkAkPJ8qEuCFVe16>";

    message.channel.send(send);
  };

  return {
    run: run,
    settings: {
      description: "Sends the link to join CalmGuild!",
      usage: "application",
      guildOnly: true,
    },
  };
}

export default ApplicationCommand();
