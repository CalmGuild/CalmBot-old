import { Channel, GuildMember, MessageEmbed, OverwriteResolvable, PermissionString } from "discord.js";
import Client from "../../structures/Client";
import Roles from "../../data/calm/roles.json";
import { IGuildSettings } from "../../schemas/GuildSettings";
import logger from "../logger/Logger";

const allow: PermissionString[] = ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "EMBED_LINKS"];

export default class Ticket {
  private owner: GuildMember | undefined;
  private type: TicketType | undefined;
  private settings: IGuildSettings | undefined;
  private client: Client | undefined;

  constructor(owner: GuildMember, type: TicketType, settings: IGuildSettings, client: Client) {
    this.owner = owner;
    this.type = type;
    this.settings = settings;
    this.client = client;
  }

  create(): Promise<Channel | undefined> {
    return new Promise(async (resolve, reject) => {
      const id = this.settings!.totalTickets + 1;
      const guild = this.owner?.guild!;

      this.settings!.totalTickets = id;
      await this.settings?.save();

      const channelOverwrites: OverwriteResolvable[] = [
        { deny: ["VIEW_CHANNEL"], id: guild.roles.everyone.id },
        { allow: allow, id: this.owner!!.id },
      ];

      const botRoleData = Roles.GENERAL.BOTS;
      const botsRole = guild.id === "501501905508237312" ? guild.roles.cache.get(botRoleData.id) : guild.roles.cache.find((r) => r.name === botRoleData.name);
      if (botsRole) channelOverwrites.push({ allow: allow, id: botsRole.id });

      this.settings!!.ticketRoles = this.settings!!.ticketRoles.filter((ele) => guild.roles.cache.has(ele));
      await this.settings?.save(); // Remove all roles in database that aren't in the server (that have been deleted)

      this.settings?.ticketRoles.forEach((roleid) => channelOverwrites.push({ allow: allow, id: roleid }));

      guild.channels
        .create(`ticket-${id}`, { permissionOverwrites: channelOverwrites, topic: `Ticket created by ${this.owner ? this.owner.user.tag : "Couldn't get user!"}` })
        .then(async (channel) => {
          let tag = this.settings?.ticketSupportedRole ? `<@&${this.settings.ticketSupportedRole}>` : "";

          let ticketEmbed = new MessageEmbed()
            .setTitle("Welcome to the ticket")
            .setDescription(`Staff will be with you shortly, please be patient. When you are ready to close this do **${this.client?.prefix}ticket close**`)
            .addField("Ticket Type:", this.type);

          channel.send(tag, ticketEmbed);
          this.settings?.tickets.push({ channel: channel.id, member: this.owner!.id });
          this.settings?.save();
          resolve(channel);
        })
        .catch((err) => {
          logger.error(err);
          reject(undefined);
        });
    });
  }

  setType(type: TicketType) {
    this.type = type;
  }
}

export enum TicketType {
  SUPPORT = "Support 🔧", // Support ticket for questions
  BUGS = "Bugs 🐞", // CalmBot bug reports
  REPORT = "Report ⚠️", // Report a member
  REDEEM = "Redeem 💰", // Redeem a tatsu reward
}

export function deleteTicket(channel: Channel, settings: IGuildSettings) {
  settings.tickets = settings.tickets.filter((ele) => {
    ele.channel != channel.id;
  });
  settings.save();
  channel.delete();
}
