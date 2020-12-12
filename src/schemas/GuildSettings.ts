import { Schema, model, Document } from "mongoose";
export interface IGuildSettings extends Document {
  guildID: string;
  disabledCommands: Array<string>;
}

const GuildSettingsScema = new Schema({
  guildID: { type: String, requried: true, index: true, unique: true },
  disabledCommands: { type: Array<string>(), default: new Array<String>() },
});

export default model<IGuildSettings>("GuildSettings", GuildSettingsScema);
