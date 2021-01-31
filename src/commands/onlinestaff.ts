import { Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";
import axios from "axios";
import { staffUUID } from "../data/calm/staffuuids";

module.exports = {
  name: "onlinestaff",
  description: "Displays all online Calm Guild Staff",
  category: "Utility",
  usage: "onlinestaff",
  run: async function run(client: Client, message: Message) {
    let onlineStaff = [];
    let tempMessage = await message.channel.send("Checking all staff! Please standby");

    for (const uuid of staffUUID) {
      try {
        const response = await axios.get(
          `https://api.hypixel.net/player?key=${process.env.HYPIXEL_TOKEN}&uuid=${uuid}`
        );
        if (response.data.player.lastLogin > response.data.player.lastLogout) {
          onlineStaff.push(response.data.player.displayname);
        }
      } catch (error) {
        console.error(error);
        tempMessage.edit("An error occured while checking for online guild staff!");
      }
    }

    let onlineStaffEmbed = new MessageEmbed()
      .setFooter(
        `${message.member.displayName} • CalmBot v${client.version}`,
        message.author.displayAvatarURL()
      )
      .setColor("#007FFF")
      .setTimestamp()
      .setTitle("Online Staff:");

    if (onlineStaff.length) {
      let prettyStaffList = onlineStaff.join("\n• ");
      onlineStaffEmbed.setDescription(`• ${prettyStaffList}`);
      tempMessage.delete();
      message.channel.send(onlineStaffEmbed);
    } else {
      onlineStaffEmbed.setDescription("No staff are currently online 😟");
      tempMessage.delete();
      message.channel.send(onlineStaffEmbed);
    }
  },
};
