import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";
import Logger from "../../../utils/logger/Logger";

function SleepCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
    let settings = await Database.getGuildSettings(message.guild.id);
    settings.sleep = !settings.sleep;
    await settings.save();

    if (!settings.sleep) {
      message.channel.send("Turned off sleep mode.");
      Logger.info("Turned off sleep mode");
    } else {
      message.channel.send("Turned on sleep mode. Run c!admin sleep to turn it off");
      Logger.info("Turned on sleep mode.");
    }
  };

  return {
    run: run,
    settings: {
      description: "Toggles sleepmode",
      usage: "admin sleep",
    },
  };
}

export default SleepCommand();
