import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";
import { IVerbals } from "../../../schemas/GuildSettings";

function InfoCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (!message.guild) return;

    const warnings = await getUserWarnings(message.guild.id, args[0] as string);
    if (warnings.length === 0) {
      message.channel.send("No warnings found for user: " + args[0]);
      return;
    }

    let membertext = args[1];
    const member = await getMember(args[0] as string, message.guild);
    if (member !== undefined) membertext = member.user.tag;

    warnings.forEach(async (warning) => {
      let embed = new MessageEmbed();
      embed.setTitle(membertext + "'s verbal warnings");
      embed.setColor("#eb1717");

      let modtext = warning.moderator;
      if (!message.guild) return;
      const mod = await getMember(warning.moderator, message.guild);
      if (mod !== undefined) modtext = mod.user.tag;

      embed.addField("Case number: ", warning.casenumber, true);
      embed.addField("Moderator: ", modtext);
      embed.addField("Time:", warning.timestamp ? warning.timestamp : "No timestamp found!");
      if (warning.reasonText !== undefined) embed.addField("Reason: ", warning.reasonText);
      if (warning.reasonImage !== undefined) embed.setImage(warning.reasonImage);

      await message.channel.send(embed);
    });
  };

  return {
    run: run,
    settings: {
      description: "Get all verbal warnings for a specific user.",
      usage: "verbal info <userid>",
      minimumArgs: 1,
    },
  };
}

export default InfoCommand();

async function getUserWarnings(guildID: string, userID: string) {
  let arr: IVerbals[] = [];
  let guildSettings = await Database.getGuildSettings(guildID);
  guildSettings.verbals.forEach((element) => {
    if (element.user === userID) {
      arr.push(element);
    }
  });
  return arr;
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
