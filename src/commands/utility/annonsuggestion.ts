import { Message, TextChannel, MessageEmbed } from "discord.js";
import Client from "../../structures/Client";
import Database from "../../utils/database/Database";
import Channels from "../../data/calm/channels.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function AnnonSuggestionCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
    let suggestion = args.join(" ");

    let suggestionChannel: TextChannel, firstReaction: string, secondReaction: string;
    if (message.guild.id === "501501905508237312") {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.id === Channels.SUGGESTIONS.SUGGESTIONS.id) as TextChannel;
      firstReaction = "615239771723137026"; //  https://cdn.discordapp.com/emojis/615239771723137026.png?v=1
      secondReaction = "615239802127777817"; // https://cdn.discordapp.com/emojis/615239802127777817.png?v=1
    } else {
      suggestionChannel = message.guild.channels.cache.find((chan) => chan.name === Channels.SUGGESTIONS.SUGGESTIONS.name) as TextChannel;
      firstReaction = "✅";
      secondReaction = "❎";
    }

    if (!suggestionChannel) {
      message.channel.send("We couldn't find the suggestion channel!");
      return;
    }

    const suggestionEmbed = new MessageEmbed().setFooter(`Anonymous Suggestion • CalmBot v${client.version}`).setColor("#007FFF").setTitle("Suggestion:").setDescription(suggestion).setTimestamp();

    // Delete message so people can not see who made suggestion
    message.delete();

    let guildSettings = await Database.getGuildSettings(message.guild.id);

    if (!(suggestionChannel instanceof TextChannel)) {
      message.channel.send("Suggestion channel not a text channel!");
    }

    suggestionChannel.send(suggestionEmbed).then((m) => {
      m.react(firstReaction);
      m.react(secondReaction);
      guildSettings.suggestions.push({ msgID: m.id, suggestorID: message.author.id, suggestorTag: message.author.tag, suggestion: suggestion });
      guildSettings.save();
    });
  };

  return {
    run: run,
    settings: {
      description: "Send a fully anonymous suggestion for the server",
      usage: "annonsuggestion <suggestion>",
      guildOnly: true,
      minimumArgs: 1,
    },
  };
}

export default AnnonSuggestionCommand();
