import { Message } from "discord.js";
import Client from "../structures/Client";

const urls = require("../data/img/cat.json");

module.exports = {
  name: "cat",
  description: "Sends a cat picture!",
  category: "Images",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    const img = urls[Math.floor(Math.random() * urls.length)];
    message.channel.send(img);
  },
};
