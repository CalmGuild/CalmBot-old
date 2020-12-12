import { Client, Message, Role } from "discord.js";
const Challenges = require("../data/calm/challenges/DecemberChallenges.json");
const Roles = require("../data/calm/roles.json");
import ChallengeParticipant from "../schemas/ChallengeParticipant";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    let discordID: string = null;

    let monthlyTeamRole: Role;
    if (message.guild.id === "501501905508237312") {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.id);
    } else {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name);
    }

    if (monthlyTeamRole === undefined || message.member.roles.cache.find((r) => r.id === monthlyTeamRole.id) === undefined) {
      discordID = message.author.id;
    } else if (args.length > 1) {
      const user = client.users.cache.find((u) => u.id === args[1]);
      if (message.guild.members.fetch(user) === undefined) {
        message.channel.send(`Could not find user with ID: ${args[1]}`);
        return;
      }
      //Converts string --> String
      discordID = args[1].toString();
    }
    if (discordID === null) discordID = message.author.id;
    const participant = ChallengeParticipant.findOne({ discordID: discordID });
    if ((await participant) === null) {
      message.channel.send("You/They have not done any challenges yet!");
      return;
    }

    let points = 0;
    let msg = `**Completed Challenges** for <@${discordID}>\n\n`;
    msg += "```";
    let easy: Array<String> = [];
    let medium: Array<String> = [];
    let hard: Array<String> = [];
    let impossibile: Array<String> = [];

    for (const [challenge, value] of (await participant).completedChallenges) {
      if (value == "true") {
        points += getChallenge(challenge).points;
        const challengeObject = getChallenge(challenge);

        if (challengeObject.id.startsWith("e")) {
          easy.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        } else if (challengeObject.id.startsWith("m")) {
          medium.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        } else if (challengeObject.id.startsWith("h")) {
          hard.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        } else if (challengeObject.id.startsWith("i")) {
          impossibile.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        }
      }
    }

    if (easy.length !== 0) msg += "\nEASY\n";
    for (const text in easy) {
      msg += easy[text];
    }
    if (medium.length !== 0) msg += "\nMEDIUM\n";
    for (const text in medium) {
      msg += medium[text];
    }
    if (hard.length !== 0) msg += "\nHARD\n";
    for (const text in hard) {
      msg += hard[text];
    }
    if (impossibile.length !== 0) msg += "\nIMPOSSIBILE\n";
    for (const text in impossibile) {
      msg += impossibile[text];
    }
    msg += "\n";
    msg += "```";
    msg += "\n\n `TOTAL POINTS:` " + points;
    message.channel.send(msg);
    return;
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
