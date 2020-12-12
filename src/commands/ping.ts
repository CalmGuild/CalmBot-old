import { Message } from "discord.js";
import Client from "../structures/Client";

module.exports = {
  name: "Ping",
  description: "Pong!",
  category: "Utility",
  run: async function ping(client: Client, message: Message) {
    message.channel.send(`Latency is \`${Date.now() - message.createdTimestamp}ms\`, Pong!`);
  },
};
