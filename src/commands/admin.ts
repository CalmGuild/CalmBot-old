import { Message, User } from "discord.js";
import Client from "../structures/Client";
import adminmanualchallenge from "../handlers/adminmanualchallenge";
module.exports = {
  name: "admin",
  description: "For admin use only",
  category: "Admin",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("Missing Permissions.\nRequired: **ADMINISTRATOR**");
      return;
    }

    if (args.length === 0) {
      message.channel.send("Invalid Arguments.");
      return;
    }

    if (args[0] === "manualchallenge") {
      adminmanualchallenge.run(client, message, args);
      return;
    }
  },
};
