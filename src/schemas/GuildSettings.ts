import { Schema, model, Document } from "mongoose";

export interface IVerbals {
  moderator: string;
  user: string;
  reasonText: string;
  reasonImage: string;
  casenumber: number;
}

interface ISuggestions {
  msgID: string;
  suggestorID: string;
  suggestorTag: string;
  suggestion: string;
}

export interface IGuildSettings extends Document {
  guildID: string;
  disabledCommands: Array<string>;
  verbals: Array<IVerbals>;
  punishmentcases: number;
  suggestions: Array<ISuggestions>;
  sleep: Boolean;
}

const GuildSettingsScema = new Schema({
  guildID: { type: String, requried: true, index: true, unique: true },
  disabledCommands: { type: Array<string>(), default: new Array<String>() },
  verbals: { type: Array<IVerbals>(), default: new Array<IVerbals>() },
  punishmentcases: { type: Number, default: 1 },
  sleep: { type: Boolean, default: false },
  suggestions: { type: Array<ISuggestions>(), default: new Array<ISuggestions>() },
});

export default model<IGuildSettings>("GuildSettings", GuildSettingsScema);
