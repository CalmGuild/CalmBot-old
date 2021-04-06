import { Message, TextChannel, MessageEmbed } from "discord.js";
import Client from "../../structures/Client";
import Database from "../../utils/database/Database";
import Channels from "../../data/calm/channels.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function SuggestCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild || !message.member) return;

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
      message.channel.send("We could not find the suggestion channel!");
      return;
    }

    const suggestionEmbed = new MessageEmbed()
      .setFooter(`${message.member.displayName} • CalmBot v${client.version}`, message.author.displayAvatarURL())
      .setColor("#007FFF")
      .setTitle("Suggestion:")
      .setDescription(args.join(" "))
      .setTimestamp();

    message.channel.send("Thanks for the suggestion! \n**Check it out: <#" + suggestionChannel.id + ">**");

    let guildSettings = await Database.getGuildSettings(message.guild.id);

    if (!(suggestionChannel instanceof TextChannel)) {
      message.channel.send("Suggestion channel not a text channel!");
    }

    suggestionChannel
      .send(suggestionEmbed)
      .then((m) => {
        m.react(firstReaction);
        m.react(secondReaction);

        guildSettings.suggestions.push({ msgID: m.id, suggestorID: message.author.id, suggestorTag: message.author.tag, suggestion: args.join(" ") });
        guildSettings.save();
      })
      .catch((e) => {
        message.channel.send("Unable to send message. Is the suggestions channel a voice channel or am I missing permission?");
      });
  };

  return {
    run: run,
    settings: {
      description: "desc",
      usage: "usage",
      guildOnly: true,
      minimumArgs: 1,
    },
  };
}

export default SuggestCommand();
