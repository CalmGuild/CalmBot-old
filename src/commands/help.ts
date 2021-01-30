import { Message, MessageEmbed } from "discord.js";
import Client from "../structures/Client";

module.exports = {
  name: "help",
  aliases: ["h", "commands"],
  category: "Information",
  description: "Displays all the commands available",
  usage: "help [command]",
  run: async (client: Client, message: Message, args: Array<String>) => {
    try {
      if (args[0]) {
        return getCommand(client, message, args[0]);
      }
      if (!args[0]) {
        return getAllCommands(client, message);
      }

      function getAllCommands(client: Client, message: Message) {
        const embed = new MessageEmbed().setAuthor(`Commands in ${message.guild.name}`, message.guild.iconURL()).setColor("#007FFF").setTimestamp();
        let categories = [...new Set(client.commands.map((cmd: any) => cmd.category))];
        for (const categoryID of categories) {
          const category = client.commands.filter((cmd: any) => cmd.category === categoryID);
          if (categoryID == "Administration") {
            var categoryIcon = ":gear:";
          }
          if (categoryID == "Moderation") {
            var categoryIcon = ":hammer:";
          }
          if (categoryID == "Fun") {
            var categoryIcon = ":game_die:";
          }
          if (categoryID == "Utility") {
            var categoryIcon = ":toolbox:";
          }
          if (categoryID == "Information") {
            var categoryIcon = ":information_source:";
          }
          if (categoryID == "Images") {
            var categoryIcon = ":camera:";
          }
          if (!categoryID) {
            var categoryIcon = ":grey_question:";
          }
          embed.addField(`${categoryIcon} ${categoryID} (${category.size})`, category.map((cmd: any) => `${cmd.name}`).join(" **|** "));
        }
        embed.addField(":question: Command Information", `${client.prefix}help <command>`);
        embed.setFooter(`CalmBot v${client.version}` + " • " + `${client.commands.size}` + " Commands", message.author.displayAvatarURL());
        return message.channel.send(embed);
      }

      function getCommand(client: Client, message: Message, input) {
        const cmd: any = client.commands.get(input.toLowerCase()) || client.aliases.get(input.toLowerCase());
        if (!cmd) {
          return message.channel.send(`No information found for command \`${client.prefix}${input.toLowerCase()}\`!`);
        } else {
          let aliasList: Object;
          if (!cmd.aliases) {
            aliasList = "None";
          } else {
            aliasList = cmd.aliases.toString().split(",").join(", ");
          }
          let permissions = cmd.permissions ? `Permissions: \`${cmd.permissions.join(", ")}\`` : "";
          const helpEmbed = new MessageEmbed()
            .setTitle(`:question: Help - ${cmd.name} command`)
            .setColor("#007FFF")
            .setTimestamp()
            .setDescription("Category: `" + cmd.category + "`\n Description: `" + cmd.description + "`\n Usage: `" + client.prefix + cmd.usage + "`\n Aliases: `" + aliasList + `\`\n ${permissions}`)
            .setFooter(`Syntax: <> = required, [] = optional • CalmBot v${client.version}`, message.author.displayAvatarURL());
          message.channel.send(helpEmbed);
        }
      }
    } catch (err) {
      message.channel.send("Sorry, we have encountered an error :sob:");
      console.log(err);
    }
  },
};
