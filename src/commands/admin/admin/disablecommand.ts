import { Message } from "discord.js"
import GuildSettings from "../../../schemas/GuildSettings";
import Client from "../../../structures/Client"
import { ICommand, RunCallback } from "../../../structures/Interfaces"
import Logger from "../../../utils/logger/Logger";

function DisableCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const cmdname = args[0]?.toLowerCase();
    if (!cmdname || !message.guild) return;
    
    if (cmdname === "admin") {
      message.channel.send("You can not disable this command!");
      return;
    }
    if (!client.commands.has(cmdname)) {
      message.channel.send("Invalid Command: " + cmdname);
      return;
    }

    let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });
    if (guildSettings === null) {
      const doc = new GuildSettings({ guildID: message.guild.id });
      await doc.save();
      guildSettings = doc;
    }

    if (guildSettings.disabledCommands.includes(cmdname as string)) {
      message.channel.send("Command already disabled!");
      return;
    }

    guildSettings.disabledCommands.push(cmdname as string);
    await guildSettings.save();
    message.channel.send(`Disabled \`${cmdname}\``);
    Logger.info(`Disabled \`${cmdname}\``);
  }

  return {
    run: run,
    settings: {
      description: "Disables a command",
      usage: "admin disablecommand <command>",
      minimumArgs: 1
    }
  }
}

export default DisableCommand();