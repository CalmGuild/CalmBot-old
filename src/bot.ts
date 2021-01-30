if (process.env.NODE_ENV !== "production") require("dotenv").config();

import path from "path";
import Client from "./structures/Client";

const bot = new Client();

bot.loadCommands(path.join(__dirname, "commands"));
bot.loadEvents(path.join(__dirname, "events"));

bot.login(process.env.BOT_TOKEN);
