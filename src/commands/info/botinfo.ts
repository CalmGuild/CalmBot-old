import { ClientUser, Message, MessageEmbed } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function BotInfoCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!client.uptime || !client.user) return;
    // Uptime Calculations:
    let daysUp = Math.floor(client.uptime / 86400000);
    let hoursUp = Math.floor(client.uptime / 3600000) % 24;
    let minutesUp = Math.floor(client.uptime / 60000) % 60;
    let secondsUp = Math.floor(client.uptime / 1000) % 60;

    const botInfoEmbed = new MessageEmbed()
      .setDescription("CalmBot, an *open-source* Discord bot built for the [Calm Community](https://discord.gg/calm)")
      .setColor("#0083dd")
      .setThumbnail(getAvatarURL(client.user))
      .setAuthor("CalmBot Info and Credits", getAvatarURL(client.user), "https://github.com/CalmGuild/CalmBot")
      .addField(
        "📝 Credits:",
        "Bot by **[Miqhtiedev](https://github.com/Miqhtiedev)** with contributions from **[SkillBeatsAll](https://github.com/SkillBeatsAll)** and [others](https://github.com/CalmGuild/CalmBot/graphs/contributors)",
        false
      )
      .addField("💻 Source Code:", "[CalmGuild GitHub Repo](https://github.com/CalmGuild/CalmBot)", false)
      .addField("Uptime:", `${daysUp} days, ${hoursUp} hours, ${minutesUp} minutes and ${secondsUp} seconds`, true);

    message.channel.send(botInfoEmbed);
  };

  return {
    run: run,
    settings: {
      description: "Information about CalmBot",
      usage: "botinfo",
    },
  };
}

function getAvatarURL(user: ClientUser): string {
  let avatarURL: string | null = user.avatarURL();
  if (avatarURL == null) {
    return "";
  }
  return avatarURL;
}

export default BotInfoCommand();
