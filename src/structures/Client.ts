import fs from "fs";
import path from "path";
import { promisify } from "util";
import Discord from "discord.js";
import Database from "../utils/database/Database";
import logger from "../utils/logger/Logger";
import { ISettings, getSettings } from "../utils/settings/Settings"

const readdir = promisify(fs.readdir);

export default class Client extends Discord.Client {
  prefix = "c!";
  version = "2.12.1";
  commands = new Discord.Collection();
  aliases = new Discord.Collection();
  settings: ISettings | undefined;

  constructor() {
    super({
      disableMentions: "everyone",
      partials: ["GUILD_MEMBER", "USER", "MESSAGE", "REACTION", "CHANNEL"],
    });

    
    Database.initialize(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`, this);
    getSettings().then((settings) => {
      this.settings = settings;
    });
  }

  async loadEvents(eventsDir: string) {
    const eventFiles = await readdir(eventsDir);

    let e = 0;
    eventFiles.forEach((file: string) => {
      const eventName = file.split(".")[0];
      const event = require(path.join(eventsDir, file));
      this.on(eventName, event.bind(null, this));

      e++;
    });
    logger.info(`Done loading ${e} events`);
  }

  async loadCommands(commandsDir: string) {
    const commandFiles = await readdir(commandsDir);

    let c = 0;
    commandFiles.forEach((file: string) => {
      const commandName = file.split(".")[0];
      const command = require(path.join(commandsDir, file));
      this.commands.set(commandName, command);
      if (command.aliases) {
        command.aliases.forEach((alias: any) => {
          this.aliases.set(alias, command);
        });
      }

      c++;
    });
    logger.info(`Done loading ${c} commands.`);
  }
}
