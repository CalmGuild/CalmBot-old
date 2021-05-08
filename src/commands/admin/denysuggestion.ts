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

    if (!suggestionChannel) return;
    suggestionChannel.messages
      .fetch(args[0])
      .then((deniedSuggestion) => {
        let suggestion = deniedSuggestion.embeds[0]?.description;

        let deniedEmbed = new MessageEmbed()
          .setFooter(deniedSuggestion.embeds[0]?.footer)
          .setColor("#f74a4a")
          .setTitle("Denied Suggestion:")
          .setDescription(suggestion)
          .addField("Denied By: ", message.author.username + "#" + message.author.discriminator)
          .setTimestamp();

        // Edits suggestion to indicate denial, and removes all reactions ("✅", "❎")
        deniedSuggestion.edit(deniedEmbed).catch((err) => {
          logger.error(err);
        });
        deniedSuggestion.reactions.removeAll();

        message.reply("Denied the suggestion.");
      })
      .catch(() => {
        message.channel.send("Could not find the suggestion! Did you use the right ID?");
      });
  };
  return {
    run: run,
    settings: {
      description: "Denies a suggestion",
      usage: "denysuggestion <suggestion id>",
      minimumArgs: 1,
      permissions: PermissionsEnum.ADMIN,
      guildOnly: true,
    },
  };
}

export default ApproveSuggestionCommand();
