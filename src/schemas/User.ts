import { Schema, model, Document } from "mongoose";
export interface IUser extends Document {
  discordID: string;
  uuid: string;
  inCalm: boolean;
}

const UserSchema = new Schema({
  discordID: { type: String, requried: true, index: true, unique: true },
  uuid: { type: String, required: true, unique: true },
  inCalm: { type: Boolean, required: true },
});

export default model<IUser>("User", UserSchema);
