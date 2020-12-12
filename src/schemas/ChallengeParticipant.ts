import { Schema, model, Document } from "mongoose";
export interface IChallengeParticipant extends Document {
  discordID: string;
  completedChallenges: Map<String, String>;
}

const ChallengeParticipantSchema = new Schema({
  discordID: { type: String, requried: true, index: true, unique: true },
  completedChallenges: { type: Map, default: new Map() },
});
export default model<IChallengeParticipant>("ChallengeParticipant", ChallengeParticipantSchema);