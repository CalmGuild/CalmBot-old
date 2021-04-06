import { Message } from "discord.js";
import Client from "../../structures/Client";
import { ICommand, RunCallback } from "../../structures/Interfaces";

const trialInfo =
  "So you want to become Calm staff?? Awesome!!!\n\n" +
  "Currently, our only requirements for Trial Officer are: Mee6 level 5+, have 2fa enabled on your account, a shareable email (for staff documents), age of 14+, and be in Calm Guild for two weeks or more!\n\n" +
  "Application: <https://forms.gle/XArRWZycn648f2aZ7>";

function TrialCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => message.channel.send(trialInfo);

  return {
    run: run,
    settings: {
      description: "Information about becoming a trial officer",
      usage: "trial",
    },
  };
}

export default TrialCommand();
