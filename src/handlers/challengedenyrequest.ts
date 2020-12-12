const Channels = require("../data/calm/channels.json");
const Roles = require("../data/calm/roles.json");
import { Client, Message, MessageEmbed, Role, TextChannel } from "discord.js";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    //ex c!challenge denyrequest (msg-id) (reason)
    if (args.length < 3) {
      message.channel.send("Error: Invalid Arguments. Ex c!challenge denyrequest (msg-id) (reason)");
      return;
    }

    const requestmessage = await message.channel.messages.fetch(args[1] as string);
    if (requestmessage === undefined) {
      message.channel.send("Unable to find request message with id " + args[1]);
      return;
    }

    let reason = "";
    for (let i = 2; i < args.length + 1; i++) {
      reason += args[i] + " ";
    }
    if (reason === "") {
      message.channel.send("Error! Invalid Reason!");
      return;
    }

    if (!requestmessage.author.bot) return; 
    const channel = message.channel as TextChannel;

    if (message.guild.id === "501501905508237312" && message.channel.id !== Channels.STAFF.CHALLENGES.id) return;
    else if (channel.name !== Channels.STAFF.CHALLENGES.name) return;

    let monthlyTeamRole: Role;
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

    if (member.roles.cache.find((r) => r.id === monthlyTeamRole.id) === undefined) {
      message.channel.send(`<@${message.author.id}> Error! As you do not have the Monthly Challenges Team role you are unable to approve this challenge!`);
      return;
    }

    if (requestmessage.embeds[0].hexColor === "#ff0000" || requestmessage.embeds[0].hexColor === "#3cff00") return;

    const fields = requestmessage.embeds[0].fields;
    const userID = fields.find((f) => f.name.toLowerCase() === "user id:").value;
    const challengeID = fields.find((f) => f.name.toLowerCase() === "challenge id:").value;

    // message.delete()
    const embed = new MessageEmbed();
    embed.setTitle(requestmessage.embeds[0].title.replace("Challenge Request", "Denied Challenge Request"));
    embed.setColor("#ff0000");
    embed.addField("Challenge ID:", challengeID);
    embed.addField("Challenge Name:", requestmessage.embeds[0].fields.find((f) => f.name === "Challenge Name:").value);

    if (requestmessage.embeds[0].image !== null) {
      embed.setImage(requestmessage.embeds[0].image.url);
    } else {
      embed.addField("Proof", requestmessage.embeds[0].fields.find((f) => f.name === "Proof").value);
    }
    embed.addField("Denied by:", message.author.username + "#" + message.author.discriminator);
    requestmessage.edit(embed);

    let commandChannel: TextChannel;
    if (message.guild.id === "501501905508237312") {
      commandChannel = message.guild.channels.cache.find((c) => c.id === Channels.COMMUNITY.COMMANDS.id) as TextChannel;
    } else {
      commandChannel = message.guild.channels.cache.find((c) => c.name === Channels.COMMUNITY.COMMANDS.name) as TextChannel;
    }

    if (commandChannel !== undefined) {
      commandChannel.send(`Sorry, <@${userID}>. You're challenge request for challenge #${challengeID} has been denied.\n**REASON:** ${reason}`);
    }
    requestmessage.reactions.removeAll();
  },
};
