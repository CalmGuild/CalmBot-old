import { GuildEmoji, Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import HypixelApi from "../utils/api/HypixelApi";
import { IPlayer } from "../utils/api/Interfaces"

module.exports = {
  name: "staff",
  description: "Displays all online Calm Guild Staff",
  category: "Utility",
  usage: "staff",
  run: async function run(client: Client, message: Message) {
    const guildStaff = await HypixelApi.getGuildStaff();
    if (!guildStaff) {
      return message.channel.send("Error: To prevent ratelimiting this command is on cooldown. Please wait a little bit and then try again.");
    }

    let onlineEmote: GuildEmoji | string, offlineEmote: GuildEmoji | string;
    if(message.guild.id === "501501905508237312") {
      onlineEmote = client.emojis.cache.find(e => e.id === "805656441704546324")
      offlineEmote = client.emojis.cache.find(e => e.id === "805656538127401000");
    } else {
      onlineEmote = "🟢";
      offlineEmote = "🔴";
    }

    const tmp = await message.channel.send("Please wait while we fetch data from the api. This could take some time.");
    
    let online = Array<IPlayer>();
    let offline = Array<IPlayer>();

    for (const member in guildStaff) {
      const player = await HypixelApi.getPlayerFromUUID(guildStaff[member].uuid);
      
      if (player.lastLogin > player.lastLogout) {
        online.push(player);
      } else {
        offline.push(player);
      }
    }

    let embedDesc = "";
    online.forEach((player) => {
      embedDesc += "`" + player.displayname + "` " + onlineEmote + "\n";
    })
    offline.forEach((player) => {
      embedDesc +=  "`" + player.displayname + "` " + offlineEmote + "\n";
    })

    
    const embed = new MessageEmbed();
    embed.setTitle("Guild Staff");
    embed.setDescription(embedDesc);
    await tmp.delete();
    await message.channel.send(embed)
  },
};

