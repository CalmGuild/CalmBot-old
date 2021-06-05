import { Message } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, PermissionsEnum, RunCallback } from "../../structures/Interfaces";
import Database from "../../utils/database/Database";
import logger from "../../utils/logger/Logger";

function ForceLinkCommand(): ICommand {
  const run: RunCallback = (client: Client, message: Message, args: string[]) => {
    const id = args[0]!!;
    Database.getUser(id)
      .then((user) => {
        message.channel.send(`\`\`\`json\n{\n  "discordID": "${user.discordID}",\n  "uuid": "${user.uuid}",\n  "inCalm": ${user.inCalm}\n}\n\`\`\``).catch((err) => logger.error(err));
      })
      .catch(() => {
        message.channel.send("Could not find user by that discordid or uuid");
      });
  };

  return {
    run: run,
    settings: {
      description: "Shows user data about a discord user",
      usage: "userdata <discord-id | mc-uuid>",
      permissions: PermissionsEnum.DEVELOPER,
      guildOnly: false,
      minimumArgs: 1,
    },
  };
}

export default ForceLinkCommand();
