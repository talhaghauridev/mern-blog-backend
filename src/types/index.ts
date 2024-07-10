import { Schema } from "mongoose";

type UserType = {
  profile_info: {
    fullName: string;
    email: string;
    username: string;
    bio?: string;
    password: string;
    profileImage?: {
      url: string;
      public_id: string;
    };
  };
  role: string;
  social_links: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  loginType: string;
  refreshToken?: string;
  blogs: Schema.Types.ObjectId[];
};

export { UserType };
