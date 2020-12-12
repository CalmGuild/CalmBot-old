import { Message } from "discord.js";
import Client from "../structures/Client"

const urls = require("../data/img/arlo.json")

module.exports = {
  name: "arlo",
  description: "Sends a picture of ARLO!!",
  category: "Images",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    const img = urls[Math.floor(Math.random() * urls.length)];
    message.channel.send(img);
  }
}