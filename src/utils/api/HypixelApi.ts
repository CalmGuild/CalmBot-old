if (process.env.NODE_ENV !== "production") require("dotenv").config();
import axios from "axios";
import * as Interface from "../api/Interfaces";
const KEY = process.env.HYPIXEL_API_KEY;
const CALM_GUILD_ID = "5af718d40cf2cbe7a9eeb063";

let APIUsage = 0;
let APILastUsed = 0;

export default {
  getGuildStaff: async function (): Promise<Interface.IGuildMember[]> {
    if (!canUseKey()) return undefined;
    const res = await axios.get(`https://api.hypixel.net/guild?key=${KEY}&id=${CALM_GUILD_ID}`);
    if (res.status !== 200) return undefined;

    const guild = res.data.guild;
    let guildStaffRanks = [];

    guild.ranks.forEach((rank) => {
      if (rank.priority >= 4) {
        guildStaffRanks.push(rank.name);
      }
    });

    let staffMembers = [];
    (guild.members as Interface.IGuildMember[]).forEach((member) => {
      if (guildStaffRanks.includes(member.rank) || member.rank === "Guild Master") staffMembers.push(member);
    });

    return staffMembers as Interface.IGuildMember[];
  },

  getPlayerFromUUID: async function (uuid: string): Promise<Interface.IPlayer> {
    if(!canUseKey()) return undefined;
    const res = await axios.get(`https://api.hypixel.net/player?key=${KEY}&uuid=${uuid}`);
    if(res.status !== 200) return undefined;
    return res.data.player;
  },
};



// Make sure we don't get ratelimited because we love rate limits
function canUseKey(): boolean {
  const date = new Date();
  if (APILastUsed < date.getMinutes()) {
    APIUsage = 1;
    APILastUsed = date.getMinutes();
    return true;
  } else {
    if (APIUsage > 120) {
      return false;
    } else {
      APIUsage++;
      return true;
    }
  }
}

