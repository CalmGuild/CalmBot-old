import { Message } from "discord.js";
import Client from "../structures/Client";

module.exports = {
  name: "trial",
  description: "Information about becoming a trial officer",
  category: "Information",
  usage: "trial",
  run: async function run(client: Client, message: Message) {
    const trialInfo =
      'So you want to become Calm staff?? Awesome!!!\n\n' +
      'Currently, our only requirements for Trial Officer are: Mee6 level 5+, have 2fa enabled on your account, a shareable email (for staff documents), age of 14+, and be in Calm Guild for two weeks or more!\n\n' +
      'Application: <https://forms.gle/XArRWZycn648f2aZ7>';
    message.channel.send(trialInfo);
  },
};


