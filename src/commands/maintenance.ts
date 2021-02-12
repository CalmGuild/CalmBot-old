import { Message, MessageManager } from "discord.js";
import Client from "../structures/Client";
import { saveSettings } from "../utils/settings/Settings";
module.exports = {
  name: "maintenance",
  description: "Puts bot into maintenance!",
  category: "Developers",
  usage: "maintenance <reason>",
  run: async function run(client: Client, message: Message, args: string[]) {
    if(!client.developers.includes(message.author.id)) return message.channel.send("Missing permissions.");
    if(client.settings.disabled) {
      client.settings.disabled = false;
      client.settings.disabledReason = undefined;
      saveSettings(client.settings);
      return message.channel.send("Turned off maintenance!");
    }

    if(args.length === 0) return message.channel.send("Please give a reason!");

    const reason = args.join(" ");
    client.settings.disabled = true;
    client.settings.disabledReason = reason;
    saveSettings(client.settings);
    return message.channel.send("Turned on maintenance!");
  },
};
