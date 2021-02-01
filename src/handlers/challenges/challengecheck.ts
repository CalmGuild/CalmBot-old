import { Message, Role } from "discord.js";
import Client from "../../structures/Client";
import ChallengeParticipant from "../../schemas/ChallengeParticipant";
const Challenges = require("../../data/calm/challenges/Challenges.json");
const Roles = require("../../data/calm/roles.json");

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

    const ogMsg = await message.channel.send("**NOTE:** Due to issues with sending a message above 2K characters and crashing the bot multiple messages will be sent. Due to discord limitations this might take a little bit. Please be patient")
    let points = 0;
    let easyCompleted: Array<String> = [];
    let mediumCompleted: Array<String> = [];
    let hardCompleted: Array<String> = [];
    let impossibleCompleted: Array<String> = [];

    for (const [challenge, value] of (await participant).completedChallenges) {
      if (value == "true") {
        points += getChallenge(challenge).points;
        const challengeObject = getChallenge(challenge);

        if (challengeObject.id.startsWith("e")) {
          easyCompleted.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        } else if (challengeObject.id.startsWith("m")) {
          mediumCompleted.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        } else if (challengeObject.id.startsWith("h")) {
          hardCompleted.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        } else if (challengeObject.id.startsWith("i")) {
          impossibleCompleted.push(`id:${challengeObject.id} | ${challengeObject.name}\n`);
        }
      }
    }

    let easyMissing: Array<String> = [];
    let mediumMissing: Array<String> = [];
    let hardMissing: Array<String> = [];
    let impossibleMissing: Array<String> = [];

    let msg2 = `\n\n**Missing Challenges**`;
    msg2 += "```";
    for (const challenge in Challenges) {
      if (!(await participant).completedChallenges.has(Challenges[challenge].id)) {
        if (Challenges[challenge].id.startsWith("e")) {
          easyMissing.push(`id:${Challenges[challenge].id} | ${Challenges[challenge].name}\n`);
        } else if (Challenges[challenge].id.startsWith("m")) {
          mediumMissing.push(`id:${Challenges[challenge].id} | ${Challenges[challenge].name}\n`);
        } else if (Challenges[challenge].id.startsWith("h")) {
          hardMissing.push(`id:${Challenges[challenge].id} | ${Challenges[challenge].name}\n`);
        } else if (Challenges[challenge].id.startsWith("i")) {
          impossibleMissing.push(`id:${Challenges[challenge].id} | ${Challenges[challenge].name}\n`);
        }
      }
    }


    let easyCompletedMsg: string = null;
    let hardCompletedMsg: string = null;
    let mediumCompletedMsg: string = null;
    let impossibleCompletedMsg: string = null;
    let easyMissingMsg: string = null;
    let mediumMissingMsg: string = null;
    let hardMissingMsg: string = null;
    let impossibleMissingMsg: string = null;


    // Format and save all messages for completed challenges.
    if(easyCompleted.length !== 0){
      easyCompletedMsg = "**EASY CHALLENGES**\n```";
      for (const challenge in easyCompleted) {
        easyCompletedMsg += easyCompleted[challenge] + "\n";
      }
      easyCompletedMsg += "```";
    }

    if(mediumCompleted.length !== 0){
      mediumCompletedMsg = "**MEDIUM CHALLENGES**\n```";
      for (const challenge in mediumCompleted) {
        mediumCompletedMsg += mediumCompleted[challenge] + "\n";
      }
      mediumCompletedMsg += "```";
    }

    if(hardCompleted.length !== 0){
      hardCompletedMsg = "**HARD CHALLENGES**\n```";
      for (const challenge in hardCompleted) {
        hardCompletedMsg += hardCompleted[challenge] + "\n";
      }
      hardCompletedMsg += "```";
    }

    if(impossibleCompleted.length !== 0){
      impossibleCompletedMsg = "**IMPOSSIBLE CHALLENGES**\n```";
      for (const challenge in impossibleCompleted) {
        impossibleCompletedMsg += impossibleCompleted[challenge] + "\n";
      }
      impossibleCompletedMsg += "```";
    }

    // Format and save all messages for missing challenges.
    
    if(easyMissing.length !== 0){
      easyMissingMsg = "**EASY CHALLENGES**\n```";
      for (const challenge in easyMissing) {
        easyMissingMsg += easyMissing[challenge] + "\n";
      }
      easyMissingMsg += "```";
    }

    if(mediumMissing.length !== 0){
      mediumMissingMsg = "**MEDIUM CHALLENGES**\n```";
      for (const challenge in mediumMissing) {
        mediumMissingMsg += mediumMissing[challenge] + "\n";
      }
      mediumMissingMsg += "```";
    }

    if(hardMissing.length !== 0){
      hardMissingMsg = "**HARD CHALLENGES**\n```";
      for (const challenge in hardMissing) {
        hardMissingMsg += hardMissing[challenge] + "\n";
      }
      hardMissingMsg += "```";
    }

    if(impossibleMissing.length !== 0){
      impossibleMissingMsg = "**IMPOSSIBLE CHALLENGES**\n```";
      for (const challenge in impossibleMissing) {
        impossibleMissingMsg += impossibleMissing[challenge] + "\n";
      }
      impossibleMissingMsg += "```";
    }

    // Send Messages
    await message.channel.send(`**Completed challenges for <@${discordID}>**`)

    if(easyCompletedMsg !== null)
    await message.channel.send(easyCompletedMsg);

    if(mediumCompletedMsg !== null)
    await message.channel.send(mediumCompletedMsg);

    if(hardCompletedMsg !== null)
    await message.channel.send(hardCompletedMsg);

    if(impossibleCompletedMsg !== null)
    await message.channel.send(impossibleCompletedMsg);

    await message.channel.send(`**Missing Challenges**`);

    if(easyMissingMsg !== null)
    await message.channel.send(easyMissingMsg);

    if(mediumMissingMsg !== null)
    await message.channel.send(mediumMissingMsg);

    if(hardMissingMsg !== null)
    await message.channel.send(hardMissingMsg);

    if(impossibleMissingMsg !== null)
    await message.channel.send(impossibleMissingMsg);

    ogMsg.delete();
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
