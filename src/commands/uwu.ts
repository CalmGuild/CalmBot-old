import { Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import uwuifier from "uwuify";

const uwuify = new uwuifier();

// I was forced to make this. I do NOT support this.

module.exports = {
  name: "uwu",
  description: "Uwuify text!",
  category: "Fun",
  usage: "ping (message)",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    if (args.length == 0) {
      return message.channel.send("Invalid arguments. Please enter text to uwuify.");
    }
    message.channel.send(new MessageEmbed().setTitle(uwuify.uwuify(args.join(" "))));
  },
};
