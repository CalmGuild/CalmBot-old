import { GuildEmoji, Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import HypixelApi from "../utils/api/HypixelApi";
import { IPlayer } from "../utils/api/Interfaces";
import logger from "../utils/logger/Logger";

module.exports = {
  name: "staff",
  description: "Displays all online Calm Guild Staff",
  category: "Utility",
  usage: "staff",
  run: async function run(client: Client, message: Message) {
    HypixelApi.getGuildStaff()
      .then(async (guildStaff) => {
        let onlineEmote: GuildEmoji | string, offlineEmote: GuildEmoji | string;
        if (message.guild.id === "501501905508237312") {
          onlineEmote = client.emojis.cache.find((e) => e.id === "805656441704546324");
          offlineEmote = client.emojis.cache.find((e) => e.id === "805656538127401000");
        } else {
          onlineEmote = "🟢";
          offlineEmote = "🔴";
        }

        const tmp = await message.channel.send("Please wait while we fetch data from the api. This could take some time.");

        let online = Array<IPlayer>();
        let offline = Array<IPlayer>();

        for (const member in guildStaff) {
          let player: IPlayer;
          try {
            player = await HypixelApi.getPlayerFromUUID(guildStaff[member].uuid);
          } catch (err) {
            logger.error(err);
            return message.channel.send("An error happened while trying to perform this command! Please contact a developer.");
          }

          if (player.lastLogin > player.lastLogout) {
            online.push(player);
          } else {
            offline.push(player);
          }
        }

        let embedDesc = "";
        online.forEach((player) => {
          embedDesc += "`" + player.displayname + "` " + onlineEmote + "\n";
        });
        offline.forEach((player) => {
          embedDesc += "`" + player.displayname + "` " + offlineEmote + "\n";
        });

        const embed = new MessageEmbed();
        embed.setTitle("Guild Staff");
        embed.setDescription(embedDesc);
        await tmp.delete();
        await message.channel.send(embed);
      })
      .catch((err) => {
        message.channel.send("That command could not be performed at this time. (this may be due to a cooldown). Please try again later!");
        logger.warn(err);
      });
  },
};
