const Roles = require("../data/calm/roles.json");
const Challenges = require("../data/calm/challenges/DecemberChallenges.json");
import { Client, Message, Role } from "discord.js";
import ChallengeParticipant from "../schemas/ChallengeParticipant";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    let monthlyTeamRole: Role;
    if (message.guild.id === "501501905508237312") {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.id);
    } else {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name);
    }

    if (monthlyTeamRole === undefined || message.member.roles.cache.find((r) => r.id === monthlyTeamRole.id) === undefined) {
      message.channel.send(`Error: You do not have ${Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name} role!`);
      return;
    }

    let lbMap = new Map<String, Number>();

    (await ChallengeParticipant.find()).forEach(async (doc) => {
      let points = 0;
      for (const [challenge, value] of doc.completedChallenges) {
        if (value === "true") points += getChallenge(challenge).points;
      }
      lbMap.set(doc.discordID, points);
    });

    //Sort map Greatest --> Least
    lbMap[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };
    let lb = [...lbMap];

    let msg = "";
    msg += `**Challenge Leaderboard**\n\n`;
    for(let i = 1; i < lb.length + 1; i++){
      msg += `\`#${i}\` | <@${lb[i - 1][0]}> with ${lb[i - 1][1]} points.\n`;
    }
    if(lb.length === 0){
      msg += "**No Entries Yet** ):"
    }
    //Make it so message does not ping
    message.channel.send("Loading Message...").then(m => {
      m.edit(msg);
    });    
  },
};

function getChallenge(id: String) {
  for (let challenge in Challenges) {
    if (Challenges[challenge].id.toLowerCase() === id.toLowerCase()) {
      return Challenges[challenge];
    }
  }
  return undefined;
}
