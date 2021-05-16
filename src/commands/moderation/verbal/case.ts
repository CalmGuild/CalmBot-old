import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";

function CastCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;
    const warning = await getWarningFromCase(message.guild.id, args[0] as string);

    if (!warning) {
      message.channel.send("Could not find an active or inactive verbal with caseid " + args[0]);
      return;
    }

    let embed = new MessageEmbed();
    embed.setTitle("Case Number: " + args[0]);
    embed.setColor("#eb1717");

    let membertext = warning.user;
    const member = await getMember(warning.user as string, message.guild);
    if (member) membertext = member.user.tag;

    let modtext = warning.moderator;
    const mod = await getMember(warning.moderator, message.guild);
    if (mod) modtext = mod.user.tag;

    embed.addField("User:", membertext);
    embed.addField("Moderator:", modtext);
    embed.addField("Time:", warning.timestamp ? warning.timestamp : "No timestamp found!");
    if (warning.reasonText) embed.addField("Reason: ", warning.reasonText);
    if (warning.reasonImage) embed.setImage(warning.reasonImage);

    message.channel.send(embed);
  };

  return {
    run: run,
    settings: {
      description: "Gets info about a verbal case",
      usage: "verbal case <case-id>",
      minimumArgs: 1,
    },
  };
}

export default CastCommand();

async function getWarningFromCase(guildID: string, caseID: string) {
  let guildSettings = await Database.getGuildSettings(guildID);
  let warning: any;
  guildSettings.verbals.forEach((element) => {
    if ((element.casenumber.toString() as string) === caseID) {
      warning = element;
    }
  });
  return warning;
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
