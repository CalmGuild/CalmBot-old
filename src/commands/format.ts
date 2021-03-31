import { GuildMember, Message, MessageAttachment, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import Roles from "../data/calm/roles.json";

const staffRoles = [Roles.GENERAL.STAFF_TEAM, Roles.GENERAL.DISCORD_STAFF, Roles.GENERAL.MANAGEMENT_TEAM];

const format = "**Type of Punishment:** PUNISHMENT_TYPE\n**Discord name & #:** DISCORD_NAME\n**Discord ID:** DISCORD_ID\n**Evidence:** REASON";
const genFormat = (punishmentType: string, name: string, id: string, reason: string): string =>
  format.replace("PUNISHMENT_TYPE", punishmentType).replace("DISCORD_NAME", name).replace("DISCORD_ID", id).replace("REASON", reason);

module.exports = {
  name: "format",
  description: "Generates a punishment format",
  category: "Util",
  usage: "format <punishment type> <user id> <reason> <attach image>",
  run: async function run(client: Client, message: Message, args: Array<String>) {
    if (!(await isMod(message.member))) {
      return message.channel.send("Missing permissions!");
    }

    if (args.length < 3) {
      return message.channel.send(`Invalid arguments!\n${client.prefix}format <punishment type> <user id> <reason> <attach image>`);
    }

    if (message.attachments.size == 0 || !attachIsImage(message.attachments.array()[0])) {
      return message.channel.send("Please attach an image as evidence!");
    }

    const userid = args[1];
    let usertag = "";

    message.guild.members
      .fetch(userid as string)
      .then((member) => {
        message.channel.send(genFormat(args[0] as string, member.user.tag, member.id, args[2] as string), { files: [message.attachments.array()[0].url] });
      })
      .catch((e) => {
        message.channel.send(genFormat(args[0] as string, "Invalid user ID", args[1] as string, args[2] as string), { files: [message.attachments.array()[0].url] });
      });
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
  var url = msgAttach.url;
  if (url === undefined) return false;
  return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}
