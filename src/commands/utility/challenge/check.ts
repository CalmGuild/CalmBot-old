import { Message, Role } from "discord.js"
import Client from "../../../structures/Client"
import { ICommand, RunCallback } from "../../../structures/Interfaces"
import Roles from "../../../data/calm/roles.json";
import Database from "../../../utils/database/Database";
import Challenges from "../../../data/calm/challenges/DecemberChallenges.json";

function CheckCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild || !message.member) return;
    let discordID: string | undefined = undefined;

    let monthlyTeamRole: Role | undefined;
    if (message.guild.id === "501501905508237312") {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.id);
    } else {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name);
    }

    if (monthlyTeamRole === undefined || message.member.roles.cache.find((r) => r.id === monthlyTeamRole?.id) === undefined) {
      discordID = message.author.id;
    } else if (args.length > 0) {
      const user: any = client.users.cache.find((u) => u.id === args[0]);
      if (message.guild.members.fetch(user) === undefined) {
        message.channel.send(`Could not find user with ID: ${args[0]}`);
        return;
      }
      //Converts string --> String
      discordID = args[0]?.toString();
    }
    if (!discordID) discordID = message.author.id;
    const participant = await Database.getChallengeParticipant(discordID);
    console.log(participant);
    
    if (participant === null) {
      message.channel.send("You/They have not done any challenges yet!");
      return;
    }

    const ogMsg = await message.channel.send(
      "**NOTE:** Due to issues with sending a message above 2K characters and crashing the bot multiple messages will be sent. Due to discord limitations this might take a little bit. Please be patient"
    );

    let easyCompleted: Array<String> = [];
    let mediumCompleted: Array<String> = [];
    let hardCompleted: Array<String> = [];
    let impossibleCompleted: Array<String> = [];

    for (const [challenge, value] of participant.completedChallenges) {
      if (value == "true") {
        console.log(challenge);
        console.log(value);
        
        const challengeObject = getChallenge(challenge)!;
        
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

    for (const [, challenge] of Object.entries(Challenges)) {
      if (!participant.completedChallenges.has(challenge.id)) {
        if (challenge.id.startsWith("e")) {
          easyMissing.push(`id:${challenge.id} | ${challenge.name}\n`);
        } else if (challenge.id.startsWith("m")) {
          mediumMissing.push(`id:${challenge.id} | ${challenge.name}\n`);
        } else if (challenge.id.startsWith("h")) {
          hardMissing.push(`id:${challenge.id} | ${challenge.name}\n`);
        } else if (challenge.id.startsWith("i")) {
          impossibleMissing.push(`id:${challenge.id} | ${challenge.name}\n`);
        }
      }
    }

    let easyCompletedMsg: string | null = null;
    let hardCompletedMsg: string | null = null;
    let mediumCompletedMsg: string | null = null;
    let impossibleCompletedMsg: string | null = null;
    let easyMissingMsg: string | null = null;
    let mediumMissingMsg: string | null = null;
    let hardMissingMsg: string | null = null;
    let impossibleMissingMsg: string | null = null;

    // Format and save all messages for completed challenges.
    if (easyCompleted.length !== 0) {
      easyCompletedMsg = "**EASY CHALLENGES**\n```";
      for (const challenge in easyCompleted) {
        easyCompletedMsg += easyCompleted[challenge] + "\n";
      }
      easyCompletedMsg += "```";
    }

    if (mediumCompleted.length !== 0) {
      mediumCompletedMsg = "**MEDIUM CHALLENGES**\n```";
      for (const challenge in mediumCompleted) {
        mediumCompletedMsg += mediumCompleted[challenge] + "\n";
      }
      mediumCompletedMsg += "```";
    }

    if (hardCompleted.length !== 0) {
      hardCompletedMsg = "**HARD CHALLENGES**\n```";
      for (const challenge in hardCompleted) {
        hardCompletedMsg += hardCompleted[challenge] + "\n";
      }
      hardCompletedMsg += "```";
    }

    if (impossibleCompleted.length !== 0) {
      impossibleCompletedMsg = "**IMPOSSIBLE CHALLENGES**\n```";
      for (const challenge in impossibleCompleted) {
        impossibleCompletedMsg += impossibleCompleted[challenge] + "\n";
      }
      impossibleCompletedMsg += "```";
    }

    // Format and save all messages for missing challenges.

    if (easyMissing.length !== 0) {
      easyMissingMsg = "**EASY CHALLENGES**\n```";
      for (const challenge in easyMissing) {
        easyMissingMsg += easyMissing[challenge] + "\n";
      }
      easyMissingMsg += "```";
    }

    if (mediumMissing.length !== 0) {
      mediumMissingMsg = "**MEDIUM CHALLENGES**\n```";
      for (const challenge in mediumMissing) {
        mediumMissingMsg += mediumMissing[challenge] + "\n";
      }
      mediumMissingMsg += "```";
    }

    if (hardMissing.length !== 0) {
      hardMissingMsg = "**HARD CHALLENGES**\n```";
      for (const challenge in hardMissing) {
        hardMissingMsg += hardMissing[challenge] + "\n";
      }
      hardMissingMsg += "```";
    }

    if (impossibleMissing.length !== 0) {
      impossibleMissingMsg = "**IMPOSSIBLE CHALLENGES**\n```";
      for (const challenge in impossibleMissing) {
        impossibleMissingMsg += impossibleMissing[challenge] + "\n";
      }
      impossibleMissingMsg += "```";
    }

    // Send Messages
    await message.channel.send(`**Completed challenges for <@${discordID}>**`);

    if (easyCompletedMsg !== null) await message.channel.send(easyCompletedMsg);

    if (mediumCompletedMsg !== null) await message.channel.send(mediumCompletedMsg);

    if (hardCompletedMsg !== null) await message.channel.send(hardCompletedMsg);

    if (impossibleCompletedMsg !== null) await message.channel.send(impossibleCompletedMsg);

    await message.channel.send(`**Missing Challenges**`);

    if (easyMissingMsg !== null) await message.channel.send(easyMissingMsg);

    if (mediumMissingMsg !== null) await message.channel.send(mediumMissingMsg);

    if (hardMissingMsg !== null) await message.channel.send(hardMissingMsg);

    if (impossibleMissingMsg !== null) await message.channel.send(impossibleMissingMsg);

    ogMsg.delete();
    return;
  }

  return {
    run: run,
    settings: {
      description: "desc",
      usage: "usage",
      guildOnly: true
    }
  }
}


export default CheckCommand()

function getChallenge(id: string) {
  for (const [, v] of Object.entries(Challenges)) {
    if (v.id === id) {
      return v;
    }
  }
  return undefined;
}
