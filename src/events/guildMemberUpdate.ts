import { GuildMember } from "discord.js";
import Roles from "../data/calm/roles.json";
import Channels from "../data/calm/channels.json";
import Client from "../structures/Client";
import Database from "../utils/database/Database";
import MojangApi from "../utils/api/MojangApi";
import logger from "../utils/logger/Logger";

export default function guildMemberUpdate(client: Client, oldMember: GuildMember, newMember: GuildMember) {
  const isCalmDiscord = newMember.guild.id === "501501905508237312";
  const calmMemberRole = isCalmDiscord ? newMember.guild.roles.cache.get(Roles.GENERAL.CALMIES.id) : newMember.guild.roles.cache.find((r) => r.name === Roles.GENERAL.CALMIES.name);
  const staffChat = isCalmDiscord ? newMember.guild.channels.cache.get(Channels.STAFF.STAFF_CHAT.id) : newMember.guild.channels.cache.find((c) => c.name === Channels.STAFF.STAFF_CHAT.name);
  if (!calmMemberRole) return;

  const newRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
  const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));

  // Member was given calmie role
  if (newRoles.size > 0 && newRoles.array()[0]?.id === calmMemberRole.id) {
    Database.getUser(newMember.id)
      .then((user) => {
        // User was in the guild before
        user.inCalm = true;
        user.save();
      })
      .catch(() => {
        // User was not in guild before
        let name = newMember.nickname;
        if (!name) {
          sendErrorToStaffChat();
          return;
        }

        // Get MC name from nickanme
        name = name.slice(name.indexOf("]") + 2);
        const j = name.indexOf(" ");
        if (j !== -1) name = name.slice(0, j);

        if (!name) {
          sendErrorToStaffChat();
          return;
        }

        // If we were able to get name get uuid of person so we can link their minecraft and discord account
        MojangApi.getUUID(name)
          .then((uuid) => {
            // Name is incorrect
            if (!uuid) {
              sendErrorToStaffChat();
              return;
            }

            // UUID is correct so we can create the document
            Database.createUser(newMember.id, uuid, true).catch(logger.error);
          })
          .catch((err) => {
            logger.error(err);
            sendErrorToStaffChat();
          });
      });
  }

  // Member was removed from calmie role
  else if (removedRoles.size > 0 && removedRoles.array()[0]?.id === calmMemberRole.id) {
    Database.getUser(newMember.id)
      .then((user) => {
        user.inCalm = false;
        user.save();
      })
      .catch(() => {
        logger.warn(`User: ${newMember.id} was removed from calmies role but never had an entry in the database`);
      });
  }

  function sendErrorToStaffChat() {
    if (staffChat && staffChat.isText()) {
      staffChat
        .send(`ERROR! ${newMember}'s nickname is not correct and we could not create a database entry for them because we could not fetch their UUID.\n**Please do ${client.prefix}forcelink ${newMember.id} <IGN>** **__ASAP__**`)
        .catch(logger.error);
    }
  }
}
