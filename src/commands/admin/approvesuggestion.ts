import { Message, MessageEmbed, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../structures/Interfaces";
import Channels from "../../data/calm/channels.json";
import logger from "../../utils/logger/Logger";

function ApproveSuggestionCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild || !args[0]) return;

    let suggestionChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.id === Channels.SUGGESTIONS.SUGGESTIONS.id) as TextChannel;
    } else {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.name === Channels.SUGGESTIONS.SUGGESTIONS.name) as TextChannel;
    }

    suggestionChannel.messages
      .fetch(args[0])
      .then((approvedSuggestion) => {
        let suggestion = approvedSuggestion.embeds[0]?.description;
        let approvedEmbed = new MessageEmbed()
          .setFooter(approvedSuggestion.embeds[0]?.footer)
          .setColor("#57ff73")
          .setTitle("Approved Suggestion:")
          .setDescription(suggestion)
          .addField("Approved By: ", message.author.username + "#" + message.author.discriminator)
          .setTimestamp();

        // Edits suggestion to indicate approval, and removes all reactions ("✅", "❎")
        approvedSuggestion.edit(approvedEmbed).catch((err) => {
          logger.error(err);
        });
        approvedSuggestion.reactions.removeAll();

        message.reply("Approved the suggestion.");
      })
      .catch(() => {
        message.channel.send("Could not find the suggestion! Did you use the right ID?");
      });
  };
  return {
    run: run,
    settings: {
      description: "Approve a suggestion",
      usage: "approvesuggestion <suggestion id>",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN,
      guildOnly: true,
    },
  };
}

export default ApproveSuggestionCommand();
