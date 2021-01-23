import { Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";

module.exports = {
  name: "botinfo",
  aliases: ["credits", "github", "source"],
  description: "Information about CalmBot",
  category: "Information",
  usage: "botinfo",
  run: async function run(client: Client, message: Message) {
    // Uptime Calculations:
    let daysUp = Math.floor(client.uptime / 86400000);
    let hoursUp = Math.floor(client.uptime / 3600000) % 24;
    let minutesUp = Math.floor(client.uptime / 60000) % 60;
    let secondsUp = Math.floor(client.uptime / 1000) % 60;

    const botInfoEmbed = new MessageEmbed()
      .setDescription("CalmBot, an *open-source* Discord bot built for the [Calm Community](https://discord.gg/calm)")
      .setColor("#0083dd")
      .setThumbnail(client.user.avatarURL())
      .setAuthor("CalmBot Info and Credits", client.user.avatarURL(), "https://github.com/CalmGuild/CalmBot")
      .addField("ℹ Version:", `v${client.version}`, false)
      .addField(
        "📝 Credits:",
        "Bot by **[Miqhtiedev](https://github.com/Miqhtiedev)** with contributions from **[SkillBeatsAll](https://github.com/SkillBeatsAll)** and [others](https://github.com/CalmGuild/CalmBot/graphs/contributors)",
        false
      )
      .addField("💻 Source Code:", "[CalmGuild GitHub Repo](https://github.com/CalmGuild/CalmBot)", false)
      .addField("Users:", client.users.cache.size, true)
      .addField("Uptime:", `${daysUp} days, ${hoursUp} hours, ${minutesUp} minutes and ${secondsUp} seconds`, true);

    message.channel.send(botInfoEmbed);
  },
};
