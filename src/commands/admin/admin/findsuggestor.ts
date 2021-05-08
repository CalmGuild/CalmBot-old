import { Message, MessageEmbed } from "discord.js";
import GuildSettings from "../../../schemas/GuildSettings";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";

function FindSuggestorCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
    
    const id = args[0];
    let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });
    if (guildSettings === null) {
      const doc = new GuildSettings({ guildID: message.guild.id });
      await doc.save();
      guildSettings = doc;
    }

    const suggestor = guildSettings.suggestions.find((element) => element.msgID === id);
    if (!suggestor) {
      message.channel.send("Could not find a suggestion with that msg id in our database.");
      return;
    }

    let embed = new MessageEmbed()
      .setTitle("Suggestion id: " + id)
      .addField("User", suggestor.suggestorTag)
      .addField("Suggestion", suggestor.suggestion)
      .addField("User ID", suggestor.suggestorID)
      .setColor("#4287f5");

    message.channel.send(embed);
  };

  return {
    run: run,
    settings: {
      description: "Get data about a suggestion",
      usage: "admin findsuggestor <suggestion id>",
      minimumArgs: 1,
    },
  };
}

export default FindSuggestorCommand();
