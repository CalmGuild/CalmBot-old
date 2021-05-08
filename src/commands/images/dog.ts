import { Message } from "discord.js";
import Client from "../../structures/Client";

import urls from "../../data/img/dog.json";
import { ICommand, RunCallback } from "../../structures/Interfaces";

function DogCommand(): ICommand {
  const run: RunCallback = async (client: Client, message: Message, args: string[]) => {
    const img = urls[Math.floor(Math.random() * urls.length)];
    if (!img) {
      message.channel.send("We could not find a picture. Please report this to a developer.");
      return;
    }
    message.channel.send(img);
  };

  return {
    run: run,
    settings: {
      description: "Send a dog picture.",
      usage: "dog",
    },
  };
}

export default DogCommand();
