import { Schema, model, Document } from "mongoose";
export interface IGuildSettings extends Document {
  guildID: string;
  disabledCommands: Array<string>;
  suggestions: Array<any>;
  sleep: Boolean;
}

const GuildSettingsScema = new Schema({
  guildID: { type: String, requried: true, index: true, unique: true },
  disabledCommands: { type: Array<string>(), default: new Array<String>() },
  suggestions: {type: Array<any>(), default: new Array<any>()},
  sleep: {type: Boolean, default: false}
});

export default model<IGuildSettings>("GuildSettings", GuildSettingsScema);
