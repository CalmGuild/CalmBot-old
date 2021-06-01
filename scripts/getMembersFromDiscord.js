require("dotenv").config();

const { Client, Intents } = require("discord.js");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const roles = require("../src/data/calm/roles.json");

const args = process.argv.slice(2);
const calmiesRole = roles.GENERAL.CALMIES;
const guildId = "5af718d40cf2cbe7a9eeb063";

const intents = new Intents([Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]);
const bot = new Client({ ws: { intents } });

async function run() {
  console.log("Bot ready!");

  if (!args[0]) {
    console.error("Provide a discord guild as the first argument");
    return;
  }
  const res = await axios.get(`https://api.hypixel.net/guild?key=${process.env.HYPIXEL_API_KEY}&id=${guildId}`);
  const guild = res?.data?.guild;
  if (!guild) {
    console.log("Invalid guild id!");
    bot.destroy();
    return;
  }

  console.log("Successfuly requested guild");

  const members = [];
  for (const [i, member] of Object.entries(guild.members)) {
    const uuid = member.uuid;

    const res = await axios.get(`https://api.mojang.com/user/profiles/${uuid}/names`);
    const names = res?.data;
    if (!names) {
      console.log("Failed to request name of " + uuid);
      members.push({ uuid, ign: "", id: "", nick: "", tag: "" });
      return;
    }
    const ign = names[names.length - 1].name;

    members.push({ uuid, ign, id: "", nick: "", tag: "" });
    console.log(`${uuid}:${ign}`);
  }

  const discordGuild = bot.guilds.cache.get(args[0]);
  if (!discordGuild) {
    console.error("The bot isn't in the guild " + args[0]);
    return;
  }

  const discordMembers = await discordGuild.members.fetch();
  for (const [id, member] of discordMembers) {
    if (!member.roles.cache.some((r) => r.id === calmiesRole.id)) continue;

    let name = member.nickname;
    if (!name) {
      console.log("Couldn't find ign for " + member.user.tag);
      continue;
    }

    name = name.slice(name.indexOf("]") + 2);
    const j = name.indexOf(" ");
    if (j !== -1) name = name.slice(0, j);

    if (!name) {
      console.log("Couldn't find ign for " + member.nickname);
      continue;
    }
    const i = members.findIndex((m) => m.ign === name);
    console.log(i);
    if (i === -1) {
      console.log(`${member.nickname} isn't in the guild`);
      continue;
    }

    members[i].id = member.user.id;
    members[i].nick = member.nickname;
    members[i].tag = member.user.tag;
  }

  bot.destroy();

  for (const member of members) {
    if (!member.id) {
      console.log(`NOT_IN_DISCORD:${member.ign}`);
    }
  }

  console.log("WRITING", members);
  fs.writeFileSync(path.join(__dirname, "members.json"), JSON.stringify(members, null, "\t"));
}

bot.on("ready", run);
bot.login(process.env.BOT_TOKEN);
