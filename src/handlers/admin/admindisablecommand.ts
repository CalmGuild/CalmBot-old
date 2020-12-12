import { Message } from "discord.js";
import GuildSettings from "../../schemas/GuildSettings";
import Client from "../../structures/Client";
export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    if (args.length < 2) {
      message.channel.send("Error! Invalid Arguments. Exmaple c!admin disablecommand (command-name)");
      return;
    }

    const cmdname = args[1];

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
  },
};
