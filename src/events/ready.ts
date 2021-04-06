import Client from "../structures/Client";
import Logger from "../utils/logger/Logger";

export default function ready(client: Client) {
  Logger.info(`${client.user?.tag} is now serving in ${client.guilds.cache.size} guilds!`);
};
