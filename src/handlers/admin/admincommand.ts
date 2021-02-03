if (process.env.NODE_ENV !== "production") require("dotenv").config();

import { Message } from "discord.js";
import Client from "../../structures/Client";
import axios from "axios";
import Logger from "../../utils/logger/Logger";

export default {
  run: async function run(client: Client, message: Message, args: Array<String>) {
    if (args.length < 2) {
      message.channel.send("Invalid Command Arguments. Ex c!admin command /gc test");
      return;
    }

    let command = "";
    for (let i = 1; i < args.length; i++) {
      command += args[i] + " ";
    }

    const ip = process.env.CALM_BOT_IP;
    const port = process.env.CALM_BOT_PORT;
    const key = process.env.CALM_BOT_KEY;

    axios
      .post("http://" + ip + ":" + port + "/chat", {
        message: command,
        key: key,
      })
      .then(
        (response) => {
          message.channel.send(`StatusCode: ${response.status} | StatusMessage: ${response.statusText}`);
        },
        (error) => {
          message.channel.send("There was an error making that request!");
          Logger.error(`Error making request to ${"http://" + ip + ":" + port + "/chat"}!!`);
          Logger.error(error);
        }
      );
  },
};
