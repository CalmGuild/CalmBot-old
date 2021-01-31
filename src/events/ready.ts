import Client from "../structures/Client";

module.exports = async function ready(client: Client) {
  console.log(" ");
  console.log(`${client.user.tag} is now serving in ${client.guilds.cache.size} guilds!`);
  console.log(" ");
};
