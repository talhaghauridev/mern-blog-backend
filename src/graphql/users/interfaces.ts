import { IUser } from "../../models/user.model";
import { UserType } from "../../types";

type UserProfileInput = {
  username: string;
};

type UploadPrfileImage = {
  file: string;
};

type UpdateProfile = {
  input: Pick<UserType["profile_info"], "bio" | "username"> &
    Pick<IUser, "social_links">;
};

export { UpdateProfile, UploadPrfileImage, UserProfileInput };
