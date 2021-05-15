import { Message, MessageAttachment } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../structures/Interfaces";

const format = "**Type of Punishment:** PUNISHMENT_TYPE\n**Discord name & #:** DISCORD_NAME\n**Discord ID:** DISCORD_ID\n**Evidence:** REASON";
const genFormat = (punishmentType: string, name: string, id: string, reason: string): string => format.replace("PUNISHMENT_TYPE", punishmentType).replace("DISCORD_NAME", name).replace("DISCORD_ID", id).replace("REASON", reason);

function FormatCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    if (args.length < 3) {
      message.channel.send(`Invalid arguments!\n${client.prefix}format <punishment type> <user id> <reason> <attach image>`);
      return;
    }

    let image: string | undefined = undefined;
    if (message.attachments.size > 0 && attachIsImage(message.attachments.array()[0]!!)) image = message.attachments.array()[0]!!.url;

    const userid = args[1];

    client.users
      .fetch(userid as string)
      .then((user) => {
        const msg = genFormat(args[0]!!, user.tag, user.id, args.slice(2, args.length).join(" ") as string);

        if (image) message.channel.send(msg, { files: [image] });
        else message.channel.send(msg);
      })
      .catch(() => {
        const msg = genFormat(args[0] as string, "Invalid user ID", args[1] as string, args.slice(2, args.length).join(" ") as string);
        if (image) message.channel.send(msg, { files: [image] });
        else message.channel.send(msg);
      });
  };

  return {
    run: run,
    settings: {
      description: "Generate a punishment format",
      usage: "format <punishment type> <user id> <reason> [attach image]",
      guildOnly: true,
      permissions: PermissionsEnum.STAFF,
    },
  };
}

function attachIsImage(msgAttach: MessageAttachment) {
  var url = msgAttach.url;
  if (url === undefined) return false;
  return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

export default FormatCommand();
