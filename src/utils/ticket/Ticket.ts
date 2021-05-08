import { Channel, GuildMember, MessageEmbed, PermissionOverwriteOption } from "discord.js";
import Client from "../../structures/Client";
import { IGuildSettings } from "../../schemas/GuildSettings";
import logger from "../logger/Logger";
const channelOverwrite: PermissionOverwriteOption = { READ_MESSAGE_HISTORY: true, SEND_MESSAGES: true, VIEW_CHANNEL: true, USE_EXTERNAL_EMOJIS: true, ATTACH_FILES: true, EMBED_LINKS: true };

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
    return new Promise((resolve, reject) => {
      const id = this.settings!.totalTickets + 1;
      const guild = this.owner?.guild!;

      this.settings!.totalTickets = id;
      this.settings?.save();

      guild.channels
        .create(`ticket-${id}`)
        .then(async (channel) => {
          // Make sure no one else can see it
          channel.updateOverwrite(guild.roles.everyone, { VIEW_CHANNEL: false });

          // Give ticket creator permissions to see ticket
          channel.updateOverwrite(this.owner!, channelOverwrite);

          // Give staff roles permission to see ticket
          this.settings!.ticketRoles.forEach((roleid) => {
            guild.roles
              .fetch(roleid)
              .then((role) => {
                if (role) channel.updateOverwrite(role, channelOverwrite);
                else {
                  this.settings!.ticketRoles = this.settings!.ticketRoles.filter((ele) => ele != roleid);
                  this.settings?.save();
                }
              })
              .catch((err) => {
                this.settings!.ticketRoles = this.settings!.ticketRoles.filter((ele) => ele != roleid);
                this.settings?.save();
              });
          });

          let tag = this.settings?.ticketSupportedRole ? `<@&${this.settings.ticketSupportedRole}>` : "";

          let ticketEmbed = new MessageEmbed()
            .setTitle("Welcome to the ticket")
            .setDescription(`Staff will be with you shortly, please be patient. When you are ready to close this do ${this.client?.prefix}ticket close`)
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
