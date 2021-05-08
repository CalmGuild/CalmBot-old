import { Message, MessageEmbed } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";
import Database from "../../utils/database/Database";
import logger from "../../utils/logger/Logger";
import Ticket, { TicketType } from "../../utils/ticket/Ticket";

let cooldown: string[] = [];

function OpenCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!.id);
    const openedTicket = settings.tickets.find((t) => t.member === message.author.id);

    if (openedTicket) {
      message.reply(`You already have an open ticket! <#${openedTicket.channel}>`);
      return;
    }

    if (cooldown.includes(message.author.id)) {
      message.channel.send("This command is on cooldown!");
      return;
    }

    cooldown.push(message.author.id);
    setTimeout(() => {
      cooldown = cooldown.filter((ele) => {
        ele != message.author.id;
      });
    }, 61000); // 10m cooldown

    const embed = new MessageEmbed()
      .setTitle("Create a ticket!")
      .setDescription("React to which type of ticket you wish to create.")
      .addField("Support", "🔧", true)
      .addField("Bugs", "🐞", true)
      .addField("Report", "⚠️", true)
      .addField("Redeem", "💰", true);
    message.channel.send(embed).then((msg) => {
      msg.react("🔧").catch(() => {});
      msg.react("🐞").catch(() => {});
      msg.react("⚠️").catch(() => {});
      msg.react("💰").catch(() => {});

      client.addReactionListener(
        msg,
        (client, reaction, user) => {
          const ticket = new Ticket(message.member!, TicketType.SUPPORT, settings, client);
          let invalid = false;
          switch (reaction.emoji.name) {
            case "🐞":
              ticket.setType(TicketType.BUGS);
              break;
            case "⚠️":
              ticket.setType(TicketType.REPORT);
              break;
            case "💰":
              ticket.setType(TicketType.REDEEM);
              break;
            case "🔧":
              ticket.setType(TicketType.SUPPORT);
              break;
            default:
              invalid = true;
              break;
          }
          if (!invalid) {
            ticket
              .create()
              .then((channel) => {
                message.reply(`Opened a ticket for you! ${channel?.toString()}`);
                msg.delete();
              })
              .catch((err) => {
                logger.error(err);
                message.reply("Unable to create that ticket! Please contact a developer!");
              });
          }
        },
        [message.author.id]
      );

      setTimeout(() => {
        msg.delete().catch(() => {});
      }, 60000);
    });
  };

  return {
    run: run,
    settings: {
      description: "Open a ticket",
      usage: "ticket open",
      guildOnly: true
    },
  };
}

export default OpenCommand();
