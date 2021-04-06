import { Message, MessageEmbed } from "discord.js";
import { ICommand, RunCallback } from "../../structures/Interfaces";
import Database from "../../utils/database/Database";
import Challenges from "../../data/calm/challenges/DecemberChallenges.json";
import Channels from "../../data/calm/channels.json";
import Client from "../../structures/Client";

function ChallengeCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    console.log("a");
    if (!args[0] || !message.guild) return;

    if (args.length < 2) {
      if (message.attachments.size === 0 || !attachIsImage(message.attachments.array()[0]?.url)) {
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

    let participant = await Database.getChallengeParticipant(message.author.id);
    console.log(participant);

    if (participant === null) return;

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

    const url: string | undefined = message.attachments.array()[0]?.url;
    if (!url && proofIsImage) return;

    const embed = new MessageEmbed();
    embed.setTitle("Challenge Request from " + message.author.username);
    embed.addField("Challenge ID:", id);
    embed.addField("Challenge Name:", getChallenge(id)?.name, true);
    if (proofIsImage) {
      embed.setImage(url!);
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
      `<@${message.author.id}>, Your challenge has been submited by review from staff. Please be patient as this can take some time.\nContact any staff with the **Monthly Challenges Team** role if you have any questions!`
    );
  };

  return {
    run: run,
    settings: {
      description: "Make a challenge request",
      usage: "challenge <id> <proof> / <check/leaderboard/denyrequest>",
      guildOnly: true,
      minimumArgs: 1,
    },
  };
}

export default ChallengeCommand();

function attachIsImage(url: string | undefined) {
  if (url === undefined) return false;
  return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

function getChallenge(id: string) {
  for (const [, v] of Object.entries(Challenges)) {
    if (v.id === id) {
      return v;
    }
  }
  return undefined;
}
