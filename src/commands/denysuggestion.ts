import { Message, TextChannel, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import Channels from "../data/calm/channels.json";

module.exports = {
  name: "denysuggestion",
  description: "Denies a suggestion!",
  category: "Admin",
  run: async function run(client: Client, message: Message, args: Array<string>) {
    // Basic checks: Adminstrator Permission; no args provided; suggestions channel
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.send("Missing Permissions.\nRequired: **ADMINISTRATOR**");
      return;
    }

    if (args.length === 0) return message.channel.send("Missing Arguments.\n**Usage:** `c!denysuggestion [message id]`");

    let suggestionChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.id === Channels.SUGGESTIONS.SUGGESTIONS.id) as TextChannel;
    } else {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.name === Channels.SUGGESTIONS.SUGGESTIONS.name) as TextChannel;
    }

    // Fetches suggestion from ID provided by user, then grabs suggestion from embed description
    var suggestion: string, deniedSuggestion: Message;
    await suggestionChannel.messages.fetch({ around: args[0], limit: 1 }).then((msg) => {
      deniedSuggestion = msg.first();

      // Checks if its in the correct channel / if it was made by the bot / if its actually an embed
      if (!deniedSuggestion || deniedSuggestion.author !== client.user || !deniedSuggestion.embeds[0]) {
        return message.channel.send("Please use the `Message ID` from the suggestion in <#" + suggestionChannel.id + ">");
      }

      suggestion = deniedSuggestion.embeds[0].description;

      let deniedEmbed = new MessageEmbed()
        .setFooter(`${message.member.displayName} • CalmBot v${client.version}`, message.author.displayAvatarURL())
        .setColor("#f74a4a")
        .setTitle("Denied Suggestion:")
        .setDescription(suggestion)
        .addField("Denied By: ", message.author.username + "#" + message.author.discriminator)
        .setTimestamp();

      // Edits suggestion to indicate denial, and removes all reactions ("✅", "❎")
      deniedSuggestion.edit(deniedEmbed);
      deniedSuggestion.reactions.removeAll();

      message.reply("Denied the suggestion.");
    });
  },
};
