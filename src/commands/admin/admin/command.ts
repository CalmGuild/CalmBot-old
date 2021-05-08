import axios, { AxiosError, AxiosResponse } from "axios";
import { Message } from "discord.js"
import Client from "../../../structures/Client"
import { ICommand, RunCallback } from "../../../structures/Interfaces"
import Logger from "../../../utils/logger/Logger";

function CommandCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const command = args.join(" ");
    console.log(command);
    console.log(args);
    
    const ip = process.env.CALM_BOT_IP;
    const port = process.env.CALM_BOT_PORT;
    const key = process.env.CALM_BOT_KEY;

    axios
      .post("http://" + ip + ":" + port + "/chat", {
        message: command,
        key: key,
      })
      .then(
        (response: AxiosResponse) => {
          message.channel.send(`${response.status}: ${response.statusText}`);
        },
        (error: AxiosError) => {
          message.channel.send("There was an error making that request!");
          Logger.error(`Error making request to ${"http://" + ip + ":" + port + "/chat"}!!`);
          Logger.error(error.code);
          Logger.error(error.message)
        }
      );
  }

  return {
    run: run,
    settings: {
      description: "Executes a command as calmbot",
      usage: "admin command <command>",
      minimumArgs: 1
    }
  }
}

export default CommandCommand();