import fs from "fs";
import path from "path";
import Discord, { Collection, Message } from "discord.js";
import Database from "../utils/database/Database";
import logger from "../utils/logger/Logger";
import { ICommand, IReactionListener, ISubCommandSettings, ReactionCallback } from "./Interfaces";

import PermissionHandler from "../utils/Permissions/Permission";
import Permission from "../utils/Permissions/Permission";

const defaultSettings: ISubCommandSettings = {
  guildOnly: false,
};

export default class Client extends Discord.Client {
  prefix = "c!";
  commands: Collection<string, ICommand> = new Collection();
  developers = ["438057670042320896" /*Miqhtie*/, "234576713005137920" /*Joel*/];
  reactionListeners: IReactionListener[] = [];

  constructor() {
    super({
      disableMentions: "everyone",
      partials: ["GUILD_MEMBER", "USER", "MESSAGE", "REACTION", "CHANNEL"],
    });

    Database.initialize(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`, this);
  }

  loadEvents(eventsDir: string) {
    // Get files in event directory
    const files = fs.readdirSync(eventsDir);

    // counter
    let e = 0;

    // time started
    let timestarted = Date.now();

    // Loop through files
    files.forEach((file: string) => {
      // Make sure file isn't a directory
      const stats = fs.statSync(path.join(eventsDir, file));
      if (!stats.isDirectory()) {
        // Get event name
        const eventName = file.split(".")[0] as string;

        // Get event function
        const event: () => void = require(path.join(eventsDir, file)).default;

        // Bind event
        this.on(eventName, event.bind(null, this));
        e++;
      }
    });
    logger.info(`Done registering ${e} events. Took ${Date.now() - timestarted}ms`);
  }

  async executeCommand(command: ICommand, message: Message, args: string[]) {
    if (command.settings?.guildOnly && !message.guild) {
      message.channel.send("This command can only be executed inside a guild!");
      return;
    }

    try {
      if (message.guild) {
        const guildSettings = await Database.getGuildSettings(message.guild!!.id);

        const commandName = message.content.substring(this.prefix.length, message.content.length).split(" ")[0]?.toLowerCase();

        if (guildSettings.sleep && commandName !== "admin") {
          message.channel.send(`Bot is in sleep mode! Do ${this.prefix}admin sleep to turn it back on!`);
          return;
        }

        if (guildSettings.disabledCommands.includes(commandName!!) && !(await Permission.isAdmin(message.member!!))) {
          message.channel.send("This command is disabled!");
          return;
        }
      }

      if (command.settings?.permissions && message.member) {
        if (!(await PermissionHandler.hasPermission(this, message.member, command.settings.permissions))) {
          message.channel.send(`Missing permissions! Required: \`${command.settings.permissions}\``);
          return;
        }
      }

      if (command.settings?.maximumArgs && command.settings?.maximumArgs < args.length) {
        message.channel.send(`Too many arguments!\nMax: ${command.settings.maximumArgs}\nProvided: ${args.length}`);
        return;
      }

      if (command.settings?.minimumArgs && command.settings?.minimumArgs > args.length) {
        message.channel.send(`Too little arguments!\nMin: ${command.settings.minimumArgs}\nProvided: ${args.length}`);
        return;
      }

      command.run(this, message, args);
    } catch (e) {
      message.channel.send("An unexpected error occured while trying to run that command!");
      logger.error(e);
      return;
    }
  }

  registerCommands(commandsDir: string, inheritCategoryFromDirectory?: boolean) {
    let timestarted = Date.now();
    if (!inheritCategoryFromDirectory) inheritCategoryFromDirectory = false;

    let parentName: string | undefined = undefined;

    if (inheritCategoryFromDirectory) {
      fs.readdirSync(commandsDir).forEach((directory) => {
        const commands = walk(path.join(commandsDir, directory), directory);
        commands.forEach((v, k) => {
          this.commands.set(k, v);
        });
      });
    } else this.commands = walk(commandsDir);

    function walk(dir: string, category?: string): Collection<string, ICommand> {
      const files = fs.readdirSync(dir);
      const commands: Collection<string, ICommand> = new Collection();

      files.forEach((file) => {
        const stats = fs.statSync(path.join(dir, file));
        const name = file.split(".")[0]?.toLowerCase() as string;
        if (stats.isFile()) {
          if (name.toLowerCase() == "subcommandsettings") return;

          const cmd: ICommand = require(path.join(dir, file)).default;
          let commandCategory: string | undefined = undefined;
          if (cmd.category) commandCategory = cmd.category;
          else if (category) commandCategory = category;

          const command: ICommand = {
            run: cmd.run,
            settings: cmd.settings,
            category: commandCategory,
          };

          if (!files.includes(name)) commands.set(name, command);
        } else if (stats.isDirectory()) {
          parentName = name;

          const subcommands = walk(path.join(dir, file));

          let options: ISubCommandSettings = defaultSettings;
          const parentFiles = fs.readdirSync(path.join(dir, parentName));
          const subcommandSettings = parentFiles.find((f) => f.toLowerCase().startsWith("subcommandsettings"));
          if (subcommandSettings) {
            options = require(path.join(dir, parentName, subcommandSettings)).default;
          } else {
            logger.warn(`No subcommandSettings.ts file found for subcommand: ${name}, using default settings!`);
          }

          let defaultSubCommand: string | undefined;
          if (files.includes(name + ".ts") || files.includes(name + ".js")) {
            defaultSubCommand = name;
            subcommands.set(name, require(path.join(dir, name)).default);
          } else {
            defaultSubCommand = options.defaultSubCommand;
          }

          const command: ICommand = {
            settings: undefined,
            category: category,
            subCommandSettings: {
              guildOnly: options.guildOnly,
              maximumArgs: options.maximumArgs,
              minimumArgs: options.minimumArgs,
              permissions: options.permissions,
              defaultSubCommand: defaultSubCommand,
            },
            subCommands: subcommands,
            run: async (client, message, args) => {
              let subcommandName: string | undefined = undefined;
              const newArgs = args.slice(0); // prevent args from being shifted
              if (command.subCommands?.has(newArgs.shift()?.toLowerCase() as string)) subcommandName = args.shift()?.toLowerCase();
              let subcommand: ICommand | undefined = undefined;

              let options = command.subCommandSettings;

              try {
                if (options?.guildOnly && !message.guild) {
                  message.channel.send("You must be in a guild to run this command!");
                  return;
                }

                if (options?.permissions && message.member) {
                  if (!(await PermissionHandler.hasPermission(client, message.member, options?.permissions))) {
                    message.channel.send(`Missing permissions! Required: \`${options?.permissions}\``);
                    return;
                  }
                }

                if (options?.maximumArgs && options?.maximumArgs < args.length) {
                  message.channel.send(`Too many arguments!\nMax: ${options.maximumArgs}\nProvided: ${args.length}`);
                  return;
                }

                if (options?.minimumArgs && options?.minimumArgs > args.length) {
                  message.channel.send(`Too little arguments!\nMin: ${options.minimumArgs}\nProvided: ${args.length}`);
                  return;
                }
              } catch (e) {
                logger.error(e);
              }

              if (subcommandName) {
                subcommand = subcommands.get(subcommandName);
              } else if (options?.defaultSubCommand) {
                subcommand = subcommands.get(options.defaultSubCommand);
              }

              if (subcommand) {
                client.executeCommand(subcommand, message, args);
              } else {
                message.channel.send(`Invalid args.`);
              }
            },
          };

          commands.set(name, command);
        }
      });
      return commands;
    }
    logger.info(`Done registering ${this.commands.size} commands. Took ${Date.now() - timestarted}ms`);
  }

  addReactionListener(message: Message, callback: ReactionCallback, userwhitelist?: string[]) {
    this.reactionListeners.push({
      messageid: message.id,
      callback: callback,
      userwhitelist: userwhitelist,
    });
  }
}
