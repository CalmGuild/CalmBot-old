import { Message } from "discord.js";
import Client from "../../structures/Client";
import Roles from "../../data/calm/roles.json";
import { ICommand, PermissionsEnum, RunCallback } from "../../structures/Interfaces";
import MojangApi from "../../utils/api/MojangApi";
import Database from "../../utils/database/Database";
import logger from "../../utils/logger/Logger";

function ForceLinkCommand(): ICommand {
  const run: RunCallback = (client: Client, message: Message, args: string[]) => {
    const calmiesRole = message.guild!!.id === "501501905508237312" ? message.guild?.roles.cache.get(Roles.GENERAL.CALMIES.id) : message.guild?.roles.cache.find((r) => r.name === Roles.GENERAL.CALMIES.name);
    if (!calmiesRole) {
      message.channel.send(`Could not find the ${Roles.GENERAL.CALMIES.name} role in this server!`);
      return;
    }

    message
      .guild!!.members.fetch(args[0]!!)
      .then((member) => {
        Database.getUser(member.id)
          .then((user) => {
            message.channel.send(`Discord user is already linked to ${user.id}`);
          })
          .catch(() => {
            MojangApi.getUUID(args[1]!!)
              .then((uuid) => {
                if (!uuid) {
                  message.channel.send("Invalid minecraft name.");
                  return;
                }

                const inCalm = member.roles.cache.has(calmiesRole.id);
                Database.createUser(member.id, uuid, inCalm)
                  .then((user) => {
                    message.channel.send(`Created new database entry!\n\`\`\`${user}\`\`\``).catch(logger.error);
                  })
                  .catch((err) => {
                    message.channel.send("An error occurred while running that command! Please contact a developer.");
                    logger.error(err);
                  });
              })
              .catch((err) => {
                message.channel.send("An error occurred while running that command! Please contact a developer.");
                logger.error(err);
              });
          });
      })
      .catch(() => {
        message.channel.send("Invalid discord id! (user not in server)");
      });
  };

  return {
    run: run,
    settings: {
      description: "Force link a discord and minecraft account",
      usage: "forcelink <discord-id> <minecraft-ign>",
      permissions: PermissionsEnum.STAFF,
      guildOnly: true,
      minimumArgs: 2,
    },
  };
}

export default ForceLinkCommand();
