import { Guild, GuildMember, Message, MessageAttachment, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import GuildSettings from "../schemas/GuildSettings";
const Roles = require("../data/calm/roles.json");

const staffRoles = [Roles.GENERAL.STAFF_TEAM, Roles.GENERAL.DISCORD_STAFF, Roles.GENERAL.MANAGEMENT_TEAM];

module.exports = {
  name: "verbal",
  description: "Moderation Command.",
  category: "Moderation",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    // c!verbal (add, remove, info) (userid, casenumber) (reason) (attached image)
    if (!(await isMod(message.member))) return message.channel.send("Missing permissions.");

    let guildSettings = await GuildSettings.findOne({ guildID: message.guild.id });
    if (guildSettings === null) {
      const doc = new GuildSettings({ guildID: message.guild.id });
      await doc.save();
      guildSettings = doc;
    }

    if (args.length === 0) {
      const embed = new MessageEmbed()
        .setTitle("Verbal Warnings")
        .setDescription("Do c!verbal help for help on how to use this command.")
        .addField("Total Cases:", guildSettings.punishmentcases - 1)
        .addField("Active Cases:", guildSettings.verbals.length)
        .setColor("#17c1eb");
      return message.channel.send(embed);
    }

    args[0] = args[0].toLowerCase();
    if (args[0] === "add") {
      // c!verbal add (userid) [reason]
      if (args.length < 2) return message.channel.send("Invalid Arguments. Example: c!verbal add (userid) (reason) (attached image)");
      if (!attachIsImage(message.attachments.array()[0])) return message.channel.send("Invalid arguments. Please provide reasoning as text and evidence as an attached image.");
      if (args.length < 3) return message.channel.send("Invalid arguments. Please provide reasoning as text and evidence as an attached image.");

      const id = args[1];

      let reason: string = "";
      let imgurl = message.attachments.array()[0].url;
      for (let i = 2; i < args.length; i++) {
        reason += args[i] + " ";
      }
      // Remove extra space
      reason.substring(0, reason.length - 1);

      let member: GuildMember = await getMember(id as string, message.guild);
      if (member === undefined) return message.channel.send(`Could not find user with id: ${id}`);

      if (reason.length > 1020) return message.channel.send("Your reason is too long. Attach an image and give text that is < 1020 characters (due to discord embed limitations)");

      const casenumber = guildSettings.punishmentcases;
      guildSettings.verbals.push({ moderator: message.author.id, user: member.id, reasonText: reason, reasonImage: imgurl, casenumber: casenumber });
      guildSettings.punishmentcases = guildSettings.punishmentcases + 1;
      await guildSettings.save();

      const embed = new MessageEmbed().setTitle(`${member.user.tag} has been verbal warned! Case: ${casenumber}`).setColor("#48db8f");
      message.channel.send(embed);
    } else if (args[0] === "remove") {
      // c!verbal remove (casenumber)
      if (args.length < 2) {
        return message.channel.send("Invalid Arguments. Example: c!verbal remove (casenumber)");
      }

      const verbal = guildSettings.verbals.find((element) => element.casenumber === Number.parseInt(args[1] as string));
      if (verbal === undefined) {
        return message.channel.send(`Could not find verbal warning with case id ${args[1]}`);
      }

      guildSettings.verbals = arrayRemove(guildSettings.verbals, verbal);
      guildSettings.save();

      const embed = new MessageEmbed().setTitle(`Removed verbal case ${args[1]}`).setColor("#48db8f");
      message.channel.send(embed);
    } else if (args[0] === "info") {
      // c!verbal info (userid)
      if (args.length < 2) return message.channel.send("Invalid Arguments. Example: c!verbal info (userid)");

      const warnings = await getUserWarnings(message.guild.id, args[1] as string);
      if (warnings.length === 0) return message.channel.send("No warnings found for user: " + args[1]);

      let membertext = args[1];
      const member = await getMember(args[1] as string, message.guild);
      if (member !== undefined) membertext = member.user.tag;

      warnings.forEach(async (warning) => {
        let embed = new MessageEmbed();
        embed.setTitle(membertext + "'s verbal warnings");
        embed.setColor("#eb1717");

        let modtext = warning.moderator;
        const mod = await getMember(warning.moderator, message.guild);
        if (mod !== undefined) modtext = mod.user.tag;

        embed.addField("Case number: ", warning.casenumber, true);
        embed.addField("Moderator: ", modtext);
        if (warning.reasonText !== undefined) embed.addField("Reason: ", warning.reasonText);
        if (warning.reasonImage !== undefined) embed.setImage(warning.reasonImage);

        await message.channel.send(embed);
      });
    } else if (args[0] === "case") {
      // c!verbal info (caseid)
      if (args.length < 2) return message.channel.send("Invalid Arguments. Example: c!verbal case (caseid)");
      const warning = await getWarningFromCase(message.guild.id, args[1] as string);

      if (warning === undefined) return message.channel.send("Could not find an active or inactive verbal with caseid " + args[1]);

      let embed = new MessageEmbed();
      embed.setTitle("Case Number: " + args[1]);
      embed.setColor("#eb1717");

      let membertext = warning.user;
      const member = await getMember(warning.user as string, message.guild);
      if (member !== undefined) membertext = member.user.tag;

      let modtext = warning.moderator;
      const mod = await getMember(warning.moderator, message.guild);
      if (mod !== undefined) modtext = mod.user.tag;

      embed.addField("User:", membertext);
      embed.addField("Moderator:", modtext);
      if (warning.reasonText !== undefined) embed.addField("Reason: ", warning.reasonText);
      if (warning.reasonImage !== undefined) embed.setImage(warning.reasonImage);

      return message.channel.send(embed);
    } else if (args[0] === "help") {
      const embed = new MessageEmbed()
        .setTitle("Verbal Warning Command:")
        .addField("c!verbal", "Shows some verbal warning information.")
        .addField("c!verbal add (discord-id) (reason) (attached-image)", "Adds a verbal warning to a user and assigns it a case number.")
        .addField("c!verbal remove (case-id)", "Removes a verbal warnings.")
        .addField("c!verbal info (user-id)", "Get all verbal warnings for a specific user.")
        .addField("c!verbal help", "Shows this message.")
        .addField("c!verbal flush", "Admin only command (mainly used in development) used to delete all verbal warns and all cases.")
        .setColor("#17c1eb");
      return message.channel.send(embed);
    } else if (args[0] === "flush") {
      if (!message.member.hasPermission(["ADMINISTRATOR"])) {
        return message.channel.send("Missing Permissions.\nREQUIRED: **ADMINISTRATOR**");
      }
      guildSettings.verbals = [];
      guildSettings.punishmentcases = 1;
      await guildSettings.save();
      return message.channel.send("Deleted all verbal warning data.");
    }
  },
};

async function isMod(member: GuildMember) {
  if (member.hasPermission(["ADMINISTRATOR"])) return true;
  let hasModRole = false;
  for (let i = 0; i < staffRoles.length; i++) {
    if (member.guild.id === "501501905508237312") {
      if (member.roles.cache.find((r) => r.id === staffRoles[i].id)) {
        return true;
      }
    } else {
      if (member.roles.cache.find((r) => r.name.toLowerCase() === staffRoles[i].name.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}

function attachIsImage(msgAttach: MessageAttachment) {
  if (msgAttach === undefined) return false;
  var url = msgAttach.url;
  if (url === undefined) return false;
  return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

async function getUserWarnings(guildID: string, userID: string) {
  let arr = [];
  let guildSettings = await GuildSettings.findOne({ guildID: guildID });
  guildSettings.verbals.forEach((element) => {
    if (element.user === userID) {
      arr.push(element);
    }
  });
  return arr;
}

function arrayRemove(arr: Array<any>, value: any) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

async function getMember(id: string, guild: Guild) {
  let member: GuildMember;
  try {
    member = await guild.members.fetch(id as string);
  } catch {
    return undefined;
  }
  return member;
}

async function getWarningFromCase(guildID: string, caseID: string) {
  let guildSettings = await GuildSettings.findOne({ guildID: guildID });
  let warning: any;
  guildSettings.verbals.forEach((element) => {
    if ((element.casenumber.toString() as string) === caseID) {
      warning = element;
    }
  });
  return warning;
}
