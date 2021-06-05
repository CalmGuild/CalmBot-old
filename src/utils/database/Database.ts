import mongoose from "mongoose";

import GuildSettings from "../../schemas/GuildSettings";
import ChallengeParticipant from "../../schemas/ChallengeParticipant";
import Client from "../../structures/Client";
import logger from "../logger/Logger";
import User, { IUser } from "../../schemas/User";

export default {
  initialize: async (url: string, client: Client) => {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to database!");
  },

  getGuildSettings: async (guildid: string) => {
    let guildSettings = await GuildSettings.findOne({ guildID: guildid });
    if (guildSettings === null) {
      logger.verbose(`Guild settings did not exist for ${guildid}... creating new document.`);
      const doc = new GuildSettings({ guildID: guildid });
      await doc.save();
      logger.verbose(`Guild settings document for ${guildid} saved.`);
      guildSettings = doc;
    }
    return guildSettings;
  },

  getChallengeParticipant: async (discordid: string) => {
    let participant = await ChallengeParticipant.findOne({ discordID: discordid });
    if (participant === null) {
      logger.verbose(`Challenge Participant document did not exist for ${discordid}... creating new document.`);
      const doc = new ChallengeParticipant({ discordID: discordid });
      await doc.save();
      logger.verbose(`Challenge Participant document for ${discordid} saved.`);
      participant = await ChallengeParticipant.findOne({ discordID: discordid });
    }
    return participant;
  },

  getUser: (id: string): Promise<IUser> => {
    return new Promise(async (resolve, reject) => {
      let user = await User.findOne({ discordID: id });
      if (user) resolve(user);
      user = await User.findOne({ uuid: id });
      if (user) resolve(user);
      reject(undefined);
    });
  },

  createUser(discordid: string, uuid: string, inCalm: boolean): Promise<IUser> {
    return new Promise((resolve, reject) => {
      const user = new User({ discordID: discordid, uuid: uuid, inCalm: inCalm });
      user
        .save()
        .then((savedUser) => {
          resolve(savedUser);
        })
        .catch((err) => reject(err));
    });
  },
};
