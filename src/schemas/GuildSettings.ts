import { Schema, model, Document } from "mongoose";
export interface IGuildSettings extends Document {
  guildID: string;
  disabledCommands: Array<string>;
  verbals: Array<any>;
  punishmentcases: number;
  sleep: Boolean;
}

const GuildSettingsScema = new Schema({
  guildID: { type: String, requried: true, index: true, unique: true },
  disabledCommands: { type: Array<string>(), default: new Array<String>() },
  verbals: { type: Array<any>(), default: new Array<any>() },
  punishmentcases: {type: Number, default: 1},
  sleep: { type: Boolean, default: false },
});

export default model<IGuildSettings>("GuildSettings", GuildSettingsScema);
