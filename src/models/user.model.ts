import { Document, model, Schema } from "mongoose";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from "../constants";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ImageType } from "../types";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: ImageType | string;
  generateAccessToken: () => string;
  isCorrectPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isCorrectPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const User = model<IUser>("User", userSchema);

export default User;
