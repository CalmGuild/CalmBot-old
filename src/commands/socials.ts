import { Message } from "discord.js";
import Client from "../structures/Client";

module.exports = {
  name: "socials",
  aliases: ["social", "socialmedia"],
  description: "Sends Guild social media, as well as the Guild Master's",
  category: "Information",
  usage: "socials",
  run: async function run(client: Client, message: Message) {
    const social =
      "**Calm Social Media**\n" +
      "Twitter: <https://twitter.com/CalmGuild>\n" +
      "Plancke: <https://plancke.io/hypixel/guild/name/calm>\n" +
      "Forums Thread: <https://hypixel.net/threads/3013892>\n" +
      "YouTube: <https://www.youtube.com/channel/UC5NBW0EG7fFRKztTL4U96AQ>\n\n" +
      "**Guild Master's Media**\n" +
      "Twitter: <https://twitter.com/ignhopez>\n" +
      "Plancke: <https://plancke.io/hypixel/player/stats/hopez>\n" +
      "Forums: <https://hypixel.net/members/1689275>\n" +
      "YouTube: <https://www.youtube.com/hopez>\n" +
      "Twitch: <https://twitch.tv/ignhopez>";
    message.channel.send(social);
  },
};
