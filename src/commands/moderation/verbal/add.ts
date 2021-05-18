import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function AddCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
    let guildSettings = await Database.getGuildSettings(message.guild.id);

    if (!attachIsImage(message.attachments.array()[0]?.url)) {
      message.channel.send("Invalid arguments. Please provide reasoning as text and evidence as an attached image.");
      return;
    }

    const id = args[0];

    let reason: string = "";
    let imgurl = message.attachments.array()[0]?.url;
    if (!imgurl) {
      message.channel.send("Unable to get image url?");
      return;
    }

    for (let i = 1; i < args.length; i++) {
      reason += args[i] + " ";
    }
    // Remove extra space
    reason.substring(0, reason.length - 1);

    let member: GuildMember | undefined = await getMember(id as string, message.guild);
    if (!member) {
      message.channel.send(`Could not find user with id: ${id}`);
      return;
    }

    if (reason.length > 1020) {
      message.channel.send("Your reason is too long. Attach an image and give text that is < 1020 characters (due to discord embed limitations)");
      return;
    }

    const casenumber = guildSettings.punishmentcases;
    guildSettings.verbals.push({ moderator: message.author.id, user: member.id, reasonText: reason, reasonImage: imgurl, casenumber: casenumber, timestamp: new Date().toDateString() });
    guildSettings.punishmentcases = guildSettings.punishmentcases + 1;
    await guildSettings.save();

    const embed = new MessageEmbed().setTitle(`${member.user.tag} has been verbal warned! Case: ${casenumber}`).setColor("#48db8f");
    message.channel.send(embed);
    message.channel.send(`**Type of Punishment**: Verbal Warning\n**Discord Name & #**: ${member.user.tag}\n**Discord ID**: ${member.id}\n**Evidence**: ${reason}`, { files: [imgurl] });
  };

  return {
    run: run,
    settings: {
      description: "Add a verbal warning to someone",
      usage: "verbal add <id> <reason> <attach picture>",
      minimumArgs: 2,
    },
  };
}

export default AddCommand();

function attachIsImage(url: string | undefined) {
  if (url === undefined) return false;
  return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

async function getMember(id: string, guild: Guild): Promise<GuildMember | undefined> {
  let member: GuildMember;
  try {
    member = await guild.members.fetch(id as string);
  } catch {
    return undefined;
  }
  return member;
}
