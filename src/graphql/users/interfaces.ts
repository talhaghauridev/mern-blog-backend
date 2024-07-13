import { IUser } from "@/models/user.model";
import { UserType } from "@/types";

type UserProfileInput = {
  username: string;
};

type UploadProfileImage = {
  file: string;
};

type UpdateProfile = {
  input: Pick<UserType["profile_info"], "bio" | "username"> &
    Pick<IUser, "social_links">;
};

type SearchUsers = {
  input: {
    query: string;
    limit?: number;
  };
};

type GetUserBlogs = {
  input: {
    draft: boolean;
    deletedDocCount: number;
    page: number;
  } & SearchUsers["input"];
};

type BlogCount = {
  input: {
    query: string;
    draft: boolean;
  };
};

type ChangePasswordInput = {
  input: {
    oldPassword: string;
    newPassword: string;
  };
};
export {
  UpdateProfile,
  UploadProfileImage,
  UserProfileInput,
  SearchUsers,
  GetUserBlogs,
  BlogCount,
  ChangePasswordInput,
};
