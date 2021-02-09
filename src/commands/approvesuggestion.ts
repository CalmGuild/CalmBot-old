import { Message, TextChannel, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import Channels from "../data/calm/channels.json";
import Permission from "../utils/Permissions/Permission";

module.exports = {
  name: "approvesuggestion",
  description: "Approve a suggestion!",
  category: "Administration",
  usage: "approvesuggestion <message id>",
  run: async function run(client: Client, message: Message, args: Array<string>) {
    if(!await Permission.isAdmin(message.member)) return message.channel.send("Missing permissions!");
    // Basic checks: no args provided; suggestions channel

    if (args.length === 0) return message.channel.send("Missing Arguments.\n**Usage:** `c!approvesuggestion [message id]`");

    let suggestionChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.id === Channels.SUGGESTIONS.SUGGESTIONS.id) as TextChannel;
    } else {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.name === Channels.SUGGESTIONS.SUGGESTIONS.name) as TextChannel;
    }

    // Fetches suggestion from ID provided by user, then grabs suggestion from embed description
    var suggestion: string, approvedSuggestion: Message;
    await suggestionChannel.messages.fetch({ around: args[0], limit: 1 }).then((msg) => {
      approvedSuggestion = msg.first();

      // Checks if its in the correct channel / if it was made by the bot / if its actually an embed
      if (!approvedSuggestion || approvedSuggestion.author !== client.user || !approvedSuggestion.embeds[0]) {
        return message.channel.send("Please use the `Message ID` from the suggestion in <#" + suggestionChannel.id + ">");
      }

      suggestion = approvedSuggestion.embeds[0].description;
      let suggestionAuthor = approvedSuggestion.embeds[0].footer.text.split(` • CalmBot v${client.version}`, 1);
      let suggestorAvatar = approvedSuggestion.embeds[0].footer.iconURL;
      let approvedEmbed = new MessageEmbed()
        .setFooter(`${suggestionAuthor} • CalmBot v${client.version}`, suggestorAvatar)
        .setColor("#57ff73")
        .setTitle("Approved Suggestion:")
        .setDescription(suggestion)
        .addField("Approved By: ", message.author.username + "#" + message.author.discriminator)
        .setTimestamp();

      // Edits suggestion to indicate approval, and removes all reactions ("✅", "❎")
      approvedSuggestion.edit(approvedEmbed);
      approvedSuggestion.reactions.removeAll();

      message.reply("Approved the suggestion.");
    });
  },
};
