import { Message } from "discord.js"
import GuildSettings from "../../../schemas/GuildSettings";
import Client from "../../../structures/Client"
import { ICommand, RunCallback } from "../../../structures/Interfaces"
import Logger from "../../../utils/logger/Logger";

function EnableCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const cmdname = args[0]?.toLowerCase();
    if (!cmdname || !message.guild) return;

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

    if (!guildSettings.disabledCommands.includes(cmdname as string)) {
      message.channel.send("Command not disabled!");
      return;
    }

    const index = guildSettings.disabledCommands.indexOf(cmdname as string);
    if (index > -1) {
      guildSettings.disabledCommands.splice(index, 1);
    }
    await guildSettings.save();
    message.channel.send(`Enabled \`${cmdname}\``);
    Logger.info(`Enabled \`${cmdname}\``);
  }

  return {
    run: run,
    settings: {
      description: "Enables a command",
      usage: "admin enablecommand <command>",
      minimumArgs: 1
    }
  }
}

export default EnableCommand();