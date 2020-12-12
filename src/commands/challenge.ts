const Channels = require("../data/calm/channels.json");
const Challenges = require("../data/calm/challenges/DecemberChallenges.json");
import Client from "../structures/Client";
import ChallengeParticipant from "../schemas/ChallengeParticipant";
import { MessageEmbed, Message, MessageAttachment } from "discord.js";

import challengecheck from "../handlers/challenges/challengecheck";
import challengeleaderboard from "../handlers/challenges/challengeleaderboard";
import challengedenyrequest from "../handlers/challenges/challengedenyrequest";
module.exports = {
  name: "challenge",
  description: "Make a challenge request doing c!challenge (challenge-id) (challenge-proof in form of picture or gamelink) ",
  category: "Utility",
  run: async function challenge(client: Client, message: Message, args: Array<String>) {
    //ex c!challenge (id) (proof-link) / attached image
    if (args.length === 0) {
      message.channel.send("Invalid Arguments. \n Example: **c!challenge (challenge-id) (proof (game link or image attachment))** \n or **c!challenge check** to check a users progress**");
      return;
    }

    if (args[0] === "check") {
      challengecheck.run(client, message, args);
      return;
    } else if (args[0] === "leaderboard") {
      challengeleaderboard.run(client, message, args);
      return;
    } else if (args[0] === "denyrequest") {
      challengedenyrequest.run(client, message, args);
      return;
    }

    if (args.length < 2) {
      if (message.attachments.size === 0 || !attachIsImage(message.attachments.array()[0])) {
        message.channel.send("Invalid arguments. Please attach an image or send a hypixel gamelink.");
        return;
      }
    }

    let proofIsImage = false;
    if (args.length < 2) {
      proofIsImage = true;
    }

    const id = args[0];
    if (getChallenge(id) === undefined) {
      message.channel.send("Invalid challenge ID! For a list of challenge ID's please see #monthly-challenges.");
      return;
    }

    let participant = await ChallengeParticipant.findOne({ discordID: message.author.id });
    if (participant === null) {
      const doc = new ChallengeParticipant({ discordID: message.author.id });
      await doc.save();
      participant = await ChallengeParticipant.findOne({ discordID: message.author.id });
    }

    if (participant.completedChallenges.get(id) === "true") {
      message.channel.send(`You have already completed challenge ${id}.`);
      return;
    }

    let proofChannel: any;
    if (message.guild.id === "501501905508237312") {
      proofChannel = message.guild.channels.cache.find((c) => c.id === Channels.STAFF.CHALLENGES.id);
    } else {
      proofChannel = message.guild.channels.cache.find((c) => c.name === Channels.STAFF.CHALLENGES.name);
    }

    if (proofChannel === undefined) {
      message.channel.send('Error! Could not find the proof channel! Tell a server admin to make a channel named **"Challenges"**');
      return;
    }

    const embed = new MessageEmbed();
    embed.setTitle("Challenge Request from " + message.author.username);
    embed.addField("Challenge ID:", id);
    embed.addField("Challenge Name:", getChallenge(id).name, true);
    if (proofIsImage) {
      embed.setImage(message.attachments.array()[0].url);
    } else {
      embed.addField("Proof", args[1]);
    }
    embed.addField("User ID:", message.author.id);
    embed.setFooter("CalmBot | v" + client.version);
    if (id.startsWith("e")) {
      embed.setColor("#34e07e");
    } else if (id.startsWith("m")) {
      embed.setColor("#d99b21");
    } else if (id.startsWith("h")) {
      embed.setColor("#d12300");
    } else {
      embed.setColor("#000000");
    }

    proofChannel.send(embed).then((m: Message) => {
      m.react("✅");
    });
    message.channel.send(
      `<@${message.author.id}>, You're challenge has been submited by review from staff. Please be patient as this can take some time.\nContact any staff with the **Monthly Challenges Team** role if you have any questions!`
    );
  },
};

function attachIsImage(msgAttach: MessageAttachment) {
  var url = msgAttach.url;
  if (url === undefined) return false;
  return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

function getChallenge(id: String) {
  for (let challenge in Challenges) {
    if (Challenges[challenge].id.toLowerCase() === id.toLowerCase()) {
      return Challenges[challenge];
    }
  }
  return undefined;
}
