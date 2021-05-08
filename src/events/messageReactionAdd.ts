import Channels from "../data/calm/channels.json";
import Roles from "../data/calm/roles.json";

import Client from "../structures/Client";
import Database from "../utils/database/Database";
import { MessageReaction, MessageEmbed, User, Message, TextChannel, Role } from "discord.js";

export default async function messageReactionAdd(client: Client, reaction: MessageReaction, user: User) {
  const reactionListener = client.reactionListeners.find((r) => r.messageid === reaction.message.id);
  if (reactionListener && !user.bot) {
    if (reactionListener.userwhitelist && !reactionListener.userwhitelist.includes(user.id)) return;
    reactionListener.callback(client, reaction, user);
    return;
  }

  if (user.bot || !reaction.message.guild) return;

  const message: Message = await reaction.message.channel.messages.fetch(reaction.message.id);
  if (!message.author.bot || !message.guild) return;
  const channel = reaction.message.guild.channels.cache.find((c) => c.id === reaction.message.channel.id);
  if (channel === undefined) return;

  if (message.guild.id === "501501905508237312" && message.channel.id !== Channels.STAFF.CHALLENGES.id) return;
  else if (message.guild.id !== "501501905508237312" && channel.name !== Channels.STAFF.CHALLENGES.name) return;

  let monthlyTeamRole: Role | undefined;
  if (message.guild.id === "501501905508237312") {
    monthlyTeamRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.id);
  } else {
    monthlyTeamRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name);
  }

  if (!monthlyTeamRole) {
    message.channel.send(`<@${user.id}> Error! Unable to find role Monthly Challenges Team in this server! Please ask a server admin to make one and then assign it to you!`);
    return;
  }

  const member = message.guild.members.fetch(user);

  if ((await member).roles.cache.find((r) => r.id === monthlyTeamRole?.id) === undefined) {
    message.channel.send(`<@${user.id}> Error! As you do not have the Monthly Challenges Team role you are unable to approve this challenge!`);
    return;
  }

  if (message.embeds[0]?.hexColor === "#ff0000" || message.embeds[0]?.hexColor === "#3cff00") return;

  if (reaction.emoji.toString() === "✅") {
    const fields = message.embeds[0]?.fields;
    const userID = fields?.find((f) => f.name.toLowerCase() === "user id:")?.value;
    const challengeID = fields?.find((f) => f.name.toLowerCase() === "challenge id:")?.value;

    if (!userID || !challengeID) return;

    let participant = await Database.getChallengeParticipant(userID);
    if (!participant) return;
    participant.completedChallenges.set(challengeID, "true");
    await participant.save();

    const embed = new MessageEmbed();
    embed.setTitle(message.embeds[0]?.title?.replace("Challenge Request", "Accepted Challenge Request"));
    embed.setColor("#3cff00");
    embed.addField("Challenge ID:", challengeID);
    embed.addField("Challenge Name:", message.embeds[0]?.fields?.find((f) => f.name === "Challenge Name:")?.value);

    if (message.embeds[0]?.image?.url) {
      embed.setImage(message.embeds[0].image.url);
    } else {
      embed.addField("Proof", message.embeds[0]?.fields?.find((f) => f.name === "Proof")?.value);
    }
    embed.addField("Accepted by:", user.username + "#" + user.discriminator);
    message.edit(embed);

    let commandChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      commandChannel = message.guild.channels.cache.find((c) => c.id === Channels.WEEKLY_MONTHLY.CHALLENGE_PROOF.id) as TextChannel;
    } else {
      commandChannel = message.guild.channels.cache.find((c) => c.name === Channels.WEEKLY_MONTHLY.CHALLENGE_PROOF.name) as TextChannel;
    }

    commandChannel = commandChannel as TextChannel;
    commandChannel?.send(`Congratulations, <@${userID}>. Your challenge request for challenge #${challengeID} has been accepted. Do ${client.prefix}challenge check, to check your progress.`);

    message.reactions.removeAll();
  }
}
