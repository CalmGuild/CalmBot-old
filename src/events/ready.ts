import Client from "../structures/Client";

module.exports = async function ready(client: Client) {
  console.log(" ");
  console.log(`${client.user.tag} is serving ${client.users.cache.size} users in ${client.guilds.cache.size} guilds!`);
  console.log(" ");
};
