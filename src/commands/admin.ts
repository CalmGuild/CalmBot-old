import { Message, Role } from "discord.js";
import Client from "../structures/Client";
import Permission from "../utils/Permissions/Permission"

import adminmanualchallenge from "../handlers/admin/adminmanualchallenge";
import admindisablecommand from "../handlers/admin/admindisablecommand";
import adminenablecommand from "../handlers/admin/adminenablecommand";
import adminsleep from "../handlers/admin/adminsleep";
import admincommand from "../handlers/admin/admincommand";
import adminfindsuggestor from "../handlers/admin/adminfindsuggestor";
import adminsay from "../handlers/admin/adminsay";

import Roles from "../data/calm/roles.json";
import Logger from "../utils/logger/Logger";
module.exports = {
  name: "admin",
  aliases: ["administrator"],
  description: "For admin use only",
  category: "Administration",
  usage: "admin <manualchallenge/disablecommand/enablecommand/sleep/command/findsuggestor/say>",
  run: async function run(client: Client, message: Message, args: Array<String>) {

    if(!await Permission.isAdmin(message.member)) {
      return message.channel.send("Missing admin permissions to execute this command!");
    }

    if (args.length === 0) {
      message.channel.send("Invalid Arguments.");
      return;
    }

    Logger.verbose(`Admin command ran by ${message.author.id}. ${message.content}`);

    args[0] = args[0].toLowerCase();
    if (args[0] === "manualchallenge") {
      adminmanualchallenge.run(client, message, args);
      return;
    } else if (args[0] === "disablecommand") {
      admindisablecommand.run(client, message, args);
      return;
    } else if (args[0] === "enablecommand") {
      adminenablecommand.run(client, message, args);
      return;
    } else if (args[0] === "sleep") {
      adminsleep.run(client, message, args);
    } else if (args[0] === "command") {
      admincommand.run(client, message, args);
    } else if (args[0] === "findsuggestor") {
      adminfindsuggestor.run(client, message, args);
    } else if (args[0] === "say") {
      adminsay.run(client, message, args);
    }
  },
};
