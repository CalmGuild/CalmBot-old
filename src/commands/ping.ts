import { Message, MessageManager } from "discord.js";
import Client from "../structures/Client";
import Permissions from "../utils/Permissions/Permission"
module.exports = {
  name: "ping",
  description: "Pong!",
  category: "Utility",
  usage: "ping",
  run: async function run(client: Client, message: Message) {
    message.channel.send(`Latency is \`${Date.now() - message.createdTimestamp}ms\`, Pong!`);
    const isadmin = await Permissions.isAdmin(message.member);
    console.log(isadmin);
  },
};
