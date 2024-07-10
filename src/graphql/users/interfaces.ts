import { IUser } from "../../models/user.model";

type UserProfileInput = {
  username: string;
};

type UploadPrfileImage = {
  file: string;
};

type UpdateProfile = {
  input: Pick<IUser["profile_info"], "bio" | "username"> &
    IUser["social_links"];
};

export { UserProfileInput, UploadPrfileImage, UpdateProfile };
