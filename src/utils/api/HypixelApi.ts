if (process.env.NODE_ENV !== "production") require("dotenv").config();
import axios, { AxiosError } from "axios";
import * as Interface from "../api/Interfaces";
import logger from "../logger/Logger";
const KEY = process.env.HYPIXEL_API_KEY;
const CALM_GUILD_ID = "5af718d40cf2cbe7a9eeb063";

let APIUsage = 0;
let APILastUsed = 0;

export default {
  getGuildStaff: async function (): Promise<Interface.IGuildMember[]> {
    return new Promise((resolve, reject) => {
      if (!canUseKey()) reject("Key overuse.");
      axios
        .get(`https://api.hypixel.net/guild?key=${KEY}&id=${CALM_GUILD_ID}`)
        .then((res) => {
          const guild = res.data?.guild || null;

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

          resolve(staffMembers);
        })
        .catch((err) => {
          reject(err);
          logger.warn(err);
        });
    });
  },

  getPlayerFromUUID: async function (uuid: string): Promise<Interface.IPlayer> {
    return new Promise((resolve, reject) => {
      if (!canUseKey()) reject("Key overuse.");
      axios
        .get(`https://api.hypixel.net/player?key=${KEY}&uuid=${uuid}`)
        .then((res) => {
          resolve(res.data.player);
        })
        .catch((error) => {
          reject(error);
          logger.warn(error);
        });
    });
  },
};

// Make sure we don't get ratelimited because we love rate limits
function canUseKey(): boolean {
  logger.http(`New request for API key. Key has been used ${APIUsage} in the last minute.`);
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
