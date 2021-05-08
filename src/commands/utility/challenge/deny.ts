import { Message, MessageEmbed, Role, TextChannel } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Channels from "../../../data/calm/channels.json";
import Roles from "../../../data/calm/roles.json";

function DenyCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.member || !message.guild) return;
    let requestmessage;
    
    try {
      requestmessage = await message.channel.messages.fetch(args[0] as string);
    } catch (e) {
      message.channel.send("Unable to find request message with id " + args[0]);
      return;
    }

    let reason = "";
    for (let i = 1; i < args.length; i++) {
      reason += args[i] + " ";
    }
    if (reason === "") {
      message.channel.send("Error! Invalid Reason!");
      return;
    }

    if (!requestmessage.author.bot) return;
    const channel = message.channel as TextChannel;

    if (message.guild.id === "501501905508237312" && message.channel.id !== Channels.STAFF.CHALLENGES.id) return;
    else if (message.guild.id !== "501501905508237312" && channel.name !== Channels.STAFF.CHALLENGES.name) return;

    let monthlyTeamRole: Role | undefined;
    if (message.guild.id === "501501905508237312") {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.id === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.id);
    } else {
      monthlyTeamRole = message.guild.roles.cache.find((r) => r.name === Roles.GENERAL.MONTHLY_CHALLENGES_TEAM.name);
    }

    if (monthlyTeamRole === undefined) {
      message.channel.send(`<@${message.author.id}> Error! Unable to find role Monthly Challenges Team in this server! Please ask a server admin to make one and then assign it to you!`);
      return;
    }

    const member = message.member;

    if (member.roles.cache.find((r) => r.id === monthlyTeamRole?.id) === undefined) {
      message.channel.send(`<@${message.author.id}> Error! As you do not have the Monthly Challenges Team role you are unable to approve this challenge!`);
      return;
    }

    if (!requestmessage.embeds[0]) return;
    if (requestmessage.embeds[0].hexColor === "#ff0000" || requestmessage.embeds[0].hexColor === "#3cff00") return;

    const fields = requestmessage.embeds[0].fields;
    if (!fields) return;
    const userID = fields.find((f) => f.name.toLowerCase() === "user id:")?.value;
    const challengeID = fields.find((f) => f.name.toLowerCase() === "challenge id:")?.value;

    const embed = new MessageEmbed();
    embed.setTitle(requestmessage.embeds[0].title?.replace("Challenge Request", "Denied Challenge Request"));
    embed.setColor("#ff0000");
    embed.addField("Challenge ID:", challengeID);
    embed.addField("Challenge Name:", requestmessage.embeds[0].fields.find((f) => f.name === "Challenge Name:")?.value);

    if (requestmessage.embeds[0].image !== null) {
      embed.setImage(requestmessage.embeds[0].image.url);
    } else {
      embed.addField("Proof", requestmessage.embeds[0].fields.find((f) => f.name === "Proof")?.value);
    }
    embed.addField("Denied by:", message.author.username + "#" + message.author.discriminator);
    requestmessage.edit(embed);

    let commandChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      commandChannel = message.guild.channels.cache.find((c) => c.id === Channels.WEEKLY_MONTHLY.CHALLENGE_PROOF.id) as TextChannel;
    } else {
      commandChannel = message.guild.channels.cache.find((c) => c.name === Channels.WEEKLY_MONTHLY.CHALLENGE_PROOF.name) as TextChannel;
    }

    if (commandChannel) {
      commandChannel.send(`Sorry, <@${userID}>. your challenge request for challenge #${challengeID} has been denied.\n**REASON:** ${reason}`);
    }
    requestmessage.reactions.removeAll();
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

export default DenyCommand();
