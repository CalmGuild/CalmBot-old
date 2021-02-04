import Client from "../structures/Client";
import Logger from "../utils/logger/Logger";

module.exports = async function ready(client: Client) {
  Logger.info(`${client.user.tag} is now serving in ${client.guilds.cache.size} guilds!`);
};
