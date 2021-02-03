import { Message, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import Logger from "../../utils/logger/Logger";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    //c!admin say (id) (message)

    if (args.length < 3) return message.channel.send("Invalid arguments");
    const channel = message.guild.channels.cache.find((c) => c.id === args[1]);
    if (channel === undefined || !(channel instanceof TextChannel)) return message.channel.send("Could not find text channel with ID " + args[1]);
    let text = "";
    for (let i = 2; i < args.length; i++) {
      text += args[i] + " ";
    }

    const txtchannel = channel as TextChannel;
    txtchannel.send(text);
    Logger.verbose(`Sent message (${text}) in ${txtchannel.name} at request from ${message.author.id}`);
  },
};
