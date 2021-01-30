import mongoose from "mongoose";

import GuildSettings from "../../schemas/GuildSettings";
import ChallengeParticipant from "../../schemas/ChallengeParticipant";

export default {
  initialize: async (url: string) => {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database!");
  },

  getGuildSettings: async (guildid: string) => {
    let guildSettings = await GuildSettings.findOne({ guildID: guildid });
    if (guildSettings === null) {
      const doc = new GuildSettings({ guildID: guildid });
      await doc.save();
      guildSettings = doc;
    }
    return guildSettings;
  },

  getChallengeParticipant: async (discordid: string) => {
    let participant = await ChallengeParticipant.findOne({ discordID: discordid });
    if (participant === null) {
      const doc = new ChallengeParticipant({ discordID: discordid });
      await doc.save();
      participant = await ChallengeParticipant.findOne({ discordID: discordid });
    }
    return participant;
  },
};
