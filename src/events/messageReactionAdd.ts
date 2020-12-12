const Channels = require("../data/calm/channels.json");
const Roles = require("../data/calm/roles.json");

import Client from "../structures/Client";
import ChallengeParticipant from "../schemas/ChallengeParticipant";
import { MessageReaction, MessageEmbed, User, Message, TextChannel, Role, GuildChannel } from "discord.js";

module.exports = async function messageReactionAdd(client: Client, reaction: MessageReaction, user: User) {
  if (user.bot) return;

  const message: Message = await reaction.message.channel.messages.fetch(reaction.message.id);
  if (!message.author.bot) return;
  const channel = reaction.message.guild.channels.cache.find((c) => c.id === reaction.message.channel.id);
  if (channel === undefined) return;

  if (message.guild.id === "501501905508237312" && message.channel.id !== Channels.STAFF.CHALLENGES.id) return;
  else if (channel.name !== Channels.STAFF.CHALLENGES.name) return;

  let monthlyTeamRole: Role;
  if (message.guild.id === "501501905508237312") {
    monthlyTeamRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.id);
  } else {
    monthlyTeamRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name);
  }

  if (monthlyTeamRole === undefined) {
    message.channel.send(`<@${user.id}> Error! Unable to find role Monthly Challenges Team in this server! Please ask a server admin to make one and then assign it to you!`);
    return;
  }

  const member = message.guild.members.fetch(user);

  if ((await member).roles.cache.find((r) => r.id === monthlyTeamRole.id) === undefined) {
    message.channel.send(`<@${user.id}> Error! As you do not have the Monthly Challenges Team role you are unable to approve this challenge!`);
    return;
  }

  if (message.embeds[0].hexColor === "#ff0000" || message.embeds[0].hexColor === "#3cff00") return;

  if (reaction.emoji.toString() === "✅") {
    const fields = message.embeds[0].fields;
    const userID = fields.find((f) => f.name.toLowerCase() === "user id:").value;
    const challengeID = fields.find((f) => f.name.toLowerCase() === "challenge id:").value;

    let participant = await ChallengeParticipant.findOne({ discordID: userID });
    participant.completedChallenges.set(challengeID, "true");
    await participant.save();

    const embed = new MessageEmbed();
    embed.setTitle(message.embeds[0].title.replace("Challenge Request", "Accepted Challenge Request"));
    embed.setColor("#3cff00");
    embed.addField("Challenge ID:", challengeID);
    embed.addField("Challenge Name:", message.embeds[0].fields.find((f) => f.name === "Challenge Name:").value);

    if (message.embeds[0].image !== null) {
      embed.setImage(message.embeds[0].image.url);
    } else {
      embed.addField("Proof", message.embeds[0].fields.find((f) => f.name === "Proof").value);
    }
    embed.addField("Accepted by:", user.username + "#" + user.discriminator);
    message.edit(embed);

    let commandChannel;
    if (message.guild.id === "501501905508237312") {
      commandChannel = message.guild.channels.cache.find((c) => c.id === Channels.COMMUNITY.COMMANDS.id);
    } else {
      commandChannel = message.guild.channels.cache.find((c) => c.name === Channels.COMMUNITY.COMMANDS.name);
    }

    if (commandChannel !== undefined) {
      commandChannel.send(`Congratulations, <@${userID}>. You're challenge request for challenge #${challengeID} has been accepted. Do ${client.prefix}challenge check, to check you're progress.`);
    }
    message.reactions.removeAll();
  } else if (reaction.emoji.toString() === "❌") {
    const fields = message.embeds[0].fields;
    const userID = fields.find((f) => f.name.toLowerCase() === "user id:").value;
    const challengeID = fields.find((f) => f.name.toLowerCase() === "challenge id:").value;

    // message.delete()
    const embed = new MessageEmbed();
    embed.setTitle(message.embeds[0].title.replace("Challenge Request", "Denied Challenge Request"));
    embed.setColor("#ff0000");
    embed.addField("Challenge ID:", challengeID);
    embed.addField("Challenge Name:", message.embeds[0].fields.find((f) => f.name === "Challenge Name:").value);

    if (message.embeds[0].image !== null) {
      embed.setImage(message.embeds[0].image.url);
    } else {
      embed.addField("Proof", message.embeds[0].fields.find((f) => f.name === "Proof").value);
    }
    embed.addField("Denied by:", user.username + "#" + user.discriminator);
    message.edit(embed);

    let commandChannel;
    if (message.guild.id === "501501905508237312") {
      commandChannel = message.guild.channels.cache.find((c) => c.id === Channels.COMMUNITY.COMMANDS.id);
    } else {
      commandChannel = message.guild.channels.cache.find((c) => c.name === Channels.COMMUNITY.COMMANDS.name);
    }

    if (commandChannel !== undefined) {
      commandChannel.send(`Sorry, <@${userID}>. You're challenge request for challenge #${challengeID} has been denied. Please DM ${user.username + "#" + user.discriminator} for more info.`);
    }
    message.reactions.removeAll();
  }
};
