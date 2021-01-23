import { Message } from "discord.js";
import Client from "../structures/Client";

module.exports = {
  name: "ping",
  description: "Pong!",
  category: "Utility",
  usage: "ping",
  run: async function run(client: Client, message: Message) {
    message.channel.send(`Latency is \`${Date.now() - message.createdTimestamp}ms\`, Pong!`);
  },
};
