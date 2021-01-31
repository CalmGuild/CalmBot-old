import { Message } from "discord.js";
import Client from "../structures/Client";

import urls from "../data/img/dog.json";

module.exports = {
  name: "dog",
  description: "Sends a dog picture!",
  category: "Images",
  usage: "dog",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    const img = urls[Math.floor(Math.random() * urls.length)];
    message.channel.send(img);
  },
};
