import { Message, User } from "discord.js";
import Client from "../../structures/Client";
import Challenges from "../../data/calm/challenges/DecemberChallenges.json";
import ChallengeParticipant from "../../schemas/ChallengeParticipant";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    // ex c!manualchallenge (userid) (challengeid) (true/false)

    if (args.length < 4) {
      message.channel.send("Invalid Arguments. ex c!admin manualchallenge (userid) (challengeid) (true/false)");
      return;
    }

    if (args[3].toLowerCase() !== "true" && args[3].toLowerCase() !== "false") {
      message.channel.send("Invalid Arguments. ex c!manualchallenge (userid) (challengeid) (true/false) <-- HERE");
      return;
    }

    let participant = await ChallengeParticipant.findOne({ discordID: args[1] as string });

    if (participant === null) {
      const user = await message.guild.members.fetch(await client.users.fetch(args[1] as string));
      if (message.guild.members.cache.find((m) => m.id === args[1]) === undefined) {
        message.channel.send("Could not find user in discord by id " + args[1]);
        return;
      }
      const doc = new ChallengeParticipant({ discordID: args[1] });
      await doc.save();
      participant = await ChallengeParticipant.findOne({ discordID: args[1] as string });
    }

    if (getChallenge(args[2]) === undefined) {
      message.channel.send(`Invalid Challenge ID: ${args[2]}`);
      return true;
    }

    if (args[3].toLowerCase() === "false") {
      let participant = await ChallengeParticipant.findOne({ discordID: args[1] as string });
      participant.completedChallenges.delete(args[2]);
      await participant.save();
      message.channel.send(`Sucsess! Set ${args[1]}'s challenge #${args[2]} to __FALSE__`);
      if (participant.completedChallenges.size === 0) {
        let participant = await ChallengeParticipant.findOne({ discordID: args[1] as string });
        await participant.delete();
        message.channel.send("Document in database for that user has been marked for deletion due to that challenge being the user's last TRUE challenge");
        return;
      }
      return;
    } else {
      let participant = await ChallengeParticipant.findOne({ discordID: args[1] as string });
      participant.completedChallenges.set(args[2], "true");
      await participant.save();
      message.channel.send(`Sucsess! Set ${args[1]}'s challenge #${args[2]} to __TRUE__`);
      return;
    }
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
