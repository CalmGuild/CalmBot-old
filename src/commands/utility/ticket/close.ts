import { Message } from "discord.js";
import Client from "../../../structures/Client";
import { ICommand, RunCallback } from "../../../structures/Interfaces";
import Database from "../../../utils/database/Database";
import { deleteTicket } from "../../../utils/ticket/Ticket";

function CloseCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const settings = await Database.getGuildSettings(message.guild!.id);
    if (!settings.tickets.find((t) => t.channel === message.channel.id)) {
      message.channel.send("You must send this command in a ticket!");
      return;
    }

    deleteTicket(message.channel, settings);
  };

  return {
    run: run,
    settings: {
      description: "Close a ticket",
      usage: "ticket close",
    },
  };
}

export default CloseCommand();
