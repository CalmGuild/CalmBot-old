import { Guild, GuildMember, Role } from "discord.js";
import Roles from "../../data/calm/roles.json";

const staffRoles = [Roles.GENERAL.DISCORD_STAFF, Roles.GENERAL.STAFF_TEAM]

const isAdmin = async function (member: GuildMember): Promise<Boolean> {
  const srOfficerRole = await getRole(member.guild, Roles.GENERAL.SR_OFFICER.id, Roles.GENERAL.SR_OFFICER.name);
  const discordManagerRole = await getRole(member.guild, Roles.GENERAL.DISCORD_MANAGER.id, Roles.GENERAL.DISCORD_MANAGER.name);

  if(srOfficerRole) {
    if(hasRole(srOfficerRole, member)) return true;
  }

  if(discordManagerRole) {
    if(hasRole(discordManagerRole, member)) return true;
  }

  return member.hasPermission(["ADMINISTRATOR"]);
}

const isStaff = async function (member: GuildMember): Promise<Boolean> {
  if(await isAdmin(member)) return true;

  const discordStaffRole = await getRole(member.guild, Roles.GENERAL.DISCORD_STAFF.id, Roles.GENERAL.DISCORD_STAFF.name);
  const guildStaffRole = await getRole(member.guild, Roles.GENERAL.STAFF_TEAM.id, Roles.GENERAL.STAFF_TEAM.name);

  if(discordStaffRole) {
    if(hasRole(discordStaffRole, member)) return true;
  }

  if(guildStaffRole) {
    if(hasRole(guildStaffRole, member)) return true;
  }

  return false;
}

export default {
  isAdmin: isAdmin,
  isStaff: isStaff
}

async function getRole(guild: Guild, roleid?: string, rolename?: string): Promise<Role> {
  if (guild.id == "501501905508237312" && roleid) {
    guild.roles
      .fetch(roleid)
      .then((role) => {
        return role;
      })
      .catch((err) => {
        return undefined;
      });
  } else if (rolename) {
    return guild.roles.cache.find((r) => r.name === rolename);
  } else {
    return undefined;
  }
}

function hasRole(role: Role, member: GuildMember) {
  return member.roles.cache.find(r => r === role)
}