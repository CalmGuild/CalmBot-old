import { Message, Role } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Roles from "../../../data/calm/roles.json";
import ChallengeParticipant from "../../../schemas/ChallengeParticipant";
import Challenges from "../../../data/calm/challenges/DecemberChallenges.json";

function LeaderboardCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild || !message.member) return;
    let monthlyTeamRole: Role | undefined;
    if (message.guild.id === "501501905508237312") {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.id);
    } else {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name);
    }

    if (monthlyTeamRole === undefined || message.member.roles.cache.find((r) => r.id === monthlyTeamRole?.id) === undefined) {
      message.channel.send(`Error: You do not have ${Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name} role!`);
      return;
    }

    let lbMap = new Map<String, Number>();

    (await ChallengeParticipant.find()).forEach(async (doc) => {
      let points = 0;
      for (const [challenge, value] of doc.completedChallenges) {
        console.log(getChallenge(challenge)?.points!);
        if (value === "true") points += getChallenge(challenge)?.points!;
      }
      lbMap.set(doc.discordID, points);
    });

    //Sort map Greatest --> Least
    lbMap[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a: any, b: any) => b[1] - a[1]);
    };
    let lb = [...lbMap];

    let msg = "";
    msg += `**Challenge Leaderboard**\n\n`;
    for (let i = 1; i < lb.length + 1; i++) {
      msg += `\`#${i}\` | <@${lb[i - 1]! [0]}> with ${lb[i - 1]! [1]} points.\n`;
    }
    if (lb.length === 0) {
      msg += "**No Entries Yet** ):";
    }
    //Make it so message does not ping
    message.channel.send("Loading Message...").then((m) => {
      m.edit(msg);
    });
  };

  return {
    run: run,
    settings: {
      description: "desc",
      usage: "usage",
      guildOnly: true,
    },
  };
}

export default LeaderboardCommand();

function getChallenge(id: string) {
  for (const [, v] of Object.entries(Challenges)) {
    if (v.id === id) {
      return v;
    }
  }
  return undefined;
}
