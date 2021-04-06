import { Message } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../structures/Interfaces";
import { saveSettings } from "../../utils/settings/Settings";

function MaintenanceCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!client.settings) {
      message.channel.send("Could not find `client.settings`");
      return;
    }

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
  }

  return {
    run: run,
    settings: {
      description: "Puts bot into maintenance",
      usage: "maintenance <reason>",
      guildOnly: false,
      permissions: PermissionsEnum.DEVELOPER,
      minimumArgs: 1
    }
  }
}

export default MaintenanceCommand()