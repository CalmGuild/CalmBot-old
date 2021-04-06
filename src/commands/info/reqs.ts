import { Message, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import channels from "../../data/calm/channels.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function ReqsCommand(): ICommand {
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
      `Our requirements can be found in ${infoChannel}!\n\n` +
      "They are also stated on our *forums thread* & on our *application*!\n" +
      "**Forums Thread**: <https://hypixel.net/threads/3013892/>\n" +
      "**Application**: <https://forms.gle/hdwJWdFsgiXdiCW58>";

    message.channel.send(send);
  };

  return {
    run: run,
    settings: {
      description: "Displays current guild requirements",
      usage: "reqs",
      guildOnly: true,
    },
  };
}

export default ReqsCommand();
