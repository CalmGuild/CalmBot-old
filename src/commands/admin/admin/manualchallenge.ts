import { Message } from "discord.js";
import Client from "../../../structures/Client";
import Challenges from "../../../data/calm/challenges/DecemberChallenges.json";
import ChallengeParticipant from "../../../schemas/ChallengeParticipant";
import Logger from "../../../utils/logger/Logger";
import { ICommand, RunCallback } from "../../../structures/Interfaces";

function SayCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!args[0] || !args[1] || !args[2] || !message.guild) return;

    if (args[2].toLowerCase() !== "true" && args[2].toLowerCase() !== "false") {
      message.channel.send("Invalid Arguments. ex c!manualchallenge (userid) (challengeid) (true/false) <-- HERE");
      return;
    }

    let participant = await ChallengeParticipant.findOne({ discordID: args[0] });

    if (participant === null) {
      if (message.guild.members.cache.find((m) => m.id === args[0]) === undefined) {
        message.channel.send("Could not find user in discord by id " + args[0]);
        return;
      }
      const doc = new ChallengeParticipant({ discordID: args[0] });
      await doc.save();
      participant = await ChallengeParticipant.findOne({ discordID: args[0] });
    }

    if (getChallenge(args[1]) === undefined) {
      message.channel.send(`Invalid Challenge ID: ${args[1]}`);
      return true;
    }

    if (args[2].toLowerCase() === "false") {
      let participant = await ChallengeParticipant.findOne({ discordID: args[0] });
      if (!participant) return;
      participant.completedChallenges.delete(args[1]);
      await participant.save();
      message.channel.send(`Sucsess! Set ${args[0]}'s challenge #${args[1]} to __FALSE__`);
      Logger.verbose(`Set ${args[0]}'s challenge #${args[1]} to FALSE`);
      if (participant.completedChallenges.size === 0) {
        let participant = await ChallengeParticipant.findOne({ discordID: args[0] });
        if (!participant) return;
        await participant.delete();
        message.channel.send("Document in database for that user has been marked for deletion due to that challenge being the user's last TRUE challenge");
        Logger.verbose(`Deleting ${args[0]}'s challenge participant document as the last entry was manually deleted by ${message.author.id}`);
        return;
      }
      return;
    } else {
      let participant = await ChallengeParticipant.findOne({ discordID: args[0] });
      if (!participant) return;
      participant.completedChallenges.set(args[1], "true");
      await participant.save();
      message.channel.send(`Sucsess! Set ${args[0]}'s challenge #${args[1]} to __TRUE__`);
      Logger.verbose(`Set ${args[0]}'s challenge #${args[1]} to TRUE`);
      return;
    }
  };

  return {
    run: run,
    settings: {
      description: "Manually set a challenge",
      usage: "admin challenge <user id> <challenge id> <true / false>",
      minimumArgs: 3,
    },
  };
}

export default SayCommand();

function getChallenge(id: string) {
  for (const [, v] of Object.entries(Challenges)) {
    if (v.id === id) {
      return v;
    }
  }
  return undefined;
}
