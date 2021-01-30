import { Message } from "discord.js";
import Database from "../../utils/database/Database";
import Client from "../../structures/Client";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    let settings = await Database.getGuildSettings(message.guild.id);
    if (settings.sleep) {
      settings.sleep = false;
      settings.save();
      message.channel.send("Turned off sleep mode");
    } else {
      settings.sleep = true;
      settings.save();
      message.channel.send("Turned on sleep mode. Run c!admin sleep to turn it off");
    }
  },
};
