import { Message } from "discord.js";
import Client from "../structures/Client";

const urls = require("../data/img/monkey.json");

module.exports = {
  name: "monkey",
  description: "Sends a monkey picture!",
  category: "Images",
  usage: "monkey",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    const img = urls[Math.floor(Math.random() * urls.length)];
    message.channel.send(img);
  },
};
