import { Message, Role } from "discord.js";
import Client from "../structures/Client";
import adminmanualchallenge from "../handlers/admin/adminmanualchallenge";
import admindisablecommand from "../handlers/admin/admindisablecommand";
import adminenablecommand from "../handlers/admin/adminenablecommand";
import adminsleep from "../handlers/admin/adminsleep";
import admincommand from "../handlers/admin/admincommand";
import adminfindsuggestor from "../handlers/admin/adminfindsuggestor";
import adminsay from "../handlers/admin/adminsay";

import Roles from "../data/calm/roles.json";
module.exports = {
  name: "admin",
  aliases: ["administrator"],
  description: "For admin use only",
  category: "Administration",
  usage: "admin <manualchallenge/disablecommand/enablecommand/sleep/command/findsuggestor/say>",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    let srOfficerRole: Role;
    if (message.guild.id === "501501905508237312") {
      srOfficerRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.SR_OFFICER.id);
    } else {
      srOfficerRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.SR_OFFICER.name);
    }

    // I know this ugly af but i was lazy
    if (!srOfficerRole) {
      if (message.guild.id !== "501501905508237312") {
        if (!message.member.hasPermission(["ADMINISTRATOR"]) && message.member.roles.cache.find((r) => r.id === srOfficerRole.id) === undefined) {
          return message.channel.send("Missing Permissions.\nRequired: **ADMINISTRATOR**");
        }
      } else {
        if (!message.member.hasPermission(["ADMINISTRATOR"]) && message.member.roles.cache.find((r) => r.id === srOfficerRole.id) === undefined) {
          return message.channel.send("Missing Permissions.\nRequired: **ADMINISTRATOR**");
        }
      }
    } else {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send("Missing Permissions.\nRequired: **ADMINISTRATOR**");
        return;
      }
    }

    if (args.length === 0) {
      message.channel.send("Invalid Arguments.");
      return;
    }

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
