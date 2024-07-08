import { model, Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  AvailableSocialLogins,
  AvailableUserRoles,
  UserLoginType,
  UserRolesEnum,
} from "../constants/constants";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../constants/env";
import { UserType } from "../types";

export interface IUser extends UserType, Document {
  isPasswordCorrect(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    profile_info: {
      fullName: {
        type: String,
        required: true,
        lowercase: true,
        minlength: [3, "FullName must be at least 3 characters"],
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Username must be at least 3 characters"],
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200 characters"],
        default: "",
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      profileImage: {
        url: {
          type: String,
          default: "",
        },
        public_url: {
          type: String,
          default: "",
        },
      },
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.USER,
      required: true,
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    loginType: {
      type: String,
      enum: AvailableSocialLogins,
      default: UserLoginType.EMAIL_PASSWORD,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("profile_info.password") && this.profile_info?.password) {
    this.profile_info.password = await bcrypt.hash(
      this.profile_info.password,
      10
    );
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  enteredPassword: string
) {
  if (!this.profile_info?.password) throw new Error("Password not set");
  return await bcrypt.compare(enteredPassword, this.profile_info.password);
};

userSchema.methods.generateAccessToken = function () {
  const { email, fullname } = this.profile_info;
  const payload = { id: this._id, role: this.role, email, fullname };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = { id: this._id };
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  this.refreshToken = refreshToken;
  return refreshToken;
};

const User: Model<IUser> = model("User", userSchema);

export default User;
