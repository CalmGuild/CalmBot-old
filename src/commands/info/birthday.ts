import { Message, TextChannel } from "discord.js";
import Client from "../../structures/Client";
import channels from "../../data/calm/channels.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function BirthdayCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    let commandsChannel: TextChannel;

    if (message.guild?.id === "501501905508237312") {
      commandsChannel = message.guild.channels.cache.find((chan) => chan.id === channels.COMMUNITY.COMMANDS.id) as TextChannel;
    } else {
      commandsChannel = message.guild?.channels.cache.find((chan) => chan.name === channels.COMMUNITY.COMMANDS.name) as TextChannel;
    }
    if (!commandsChannel) {
      message.reply("we could not find the commands channel!");
      return;
    }

    message.channel.send(
      `Want a special **Birthday Nerd** role when it's your birthday?????? AWESOME! FOLLOW THE INSTRUCTIONS BELOW!\n\nGo to ${commandsChannel} and execute the command below with your birthday:\n\nCommand: \`bb.set (date) [timezone]\`\n- Example: *bb.set oct-21 es*\n\nFor the timezone, click this link and copy the timezone given EXACTLY how it is: <https://xske.github.io/tz/>`
    );
  };

  return {
    run: run,
    settings: {
      description: "Explains how to set your birthday",
      usage: "birthday",
      guildOnly: true,
    },
  };
}

export default BirthdayCommand();
