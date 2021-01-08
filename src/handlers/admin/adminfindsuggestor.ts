import { Message } from "discord.js";
import GuildSettings from "../../schemas/GuildSettings";
import Client from "../../structures/Client";
import { MessageEmbed } from "discord.js";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    // c!admin findsuggestor (id)
    if (args.length < 2) {
      return message.channel.send("Invalid Arguments. Ex c!admin findsuggestor (id)");
    }

    const id = args[1];
    let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });
    if (guildSettings === null) {
      const doc = new GuildSettings({ guildID: message.guild.id });
      await doc.save();
      guildSettings = doc;
    }

    const suggestor = guildSettings.suggestions.find((element) => element.msgID === id);
    if (suggestor === undefined) {
      return message.channel.send("Could not find a suggestion with that msg id in our database.");
    }

    let embed = new MessageEmbed()
      .setTitle("Suggestion id: " + id)
      .addField("User", suggestor.suggestorTag)
      .addField("Suggestion", suggestor.suggestion)
      .addField("User ID", suggestor.suggestorID)
      .setColor("#4287f5");

    message.channel.send(embed);
  },
};
