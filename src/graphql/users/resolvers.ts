import { ErrorTypes } from "../../constants/ErrorTypes";
import User from "../../models/user.model";
import ApolloError from "../../utils/ApolloError";
import { removeFromCloudinary, uploadCloudinary } from "../../utils/cloudinary";
import { Context, verifyUser } from "../../utils/context";
import {
  UpdateProfile,
  UploadPrfileImage,
  UserProfileInput,
} from "./interfaces";

const queries = {
  getMyProfile: async (_: any, args: any, ctx: Context) => {
    const user = await verifyUser(ctx);
    return user;
  },
};

const mutations = {
  userProfile: async (_: any, { username }: UserProfileInput) => {
    if (!username) {
      return ApolloError("Please Provide username", ErrorTypes.BAD_USER_INPUT);
    }

    const user = await User.findOne({
      "profile_info.username": username,
    }).select("-profile_info.password -loginType -updatedAt -blogs");

    if (!user) {
      return ApolloError("User not found", ErrorTypes.NOT_FOUND);
    }
    return user;
  },
  uploadProfileImage: async (
    _: any,
    { file }: UploadPrfileImage,
    ctx: Context
  ) => {
    const user = await verifyUser(ctx);
    if (!file) {
      return ApolloError("No file provided", ErrorTypes.BAD_USER_INPUT);
    }
    const { profileImage } = user.profile_info;
    if (profileImage?.public_id && profileImage.url) {
      await removeFromCloudinary(profileImage.public_id);
    }

    const response = await uploadCloudinary(file, "users");

    user.profile_info.profileImage = {
      url: response.secure_url,
      public_id: response.public_id,
    };

    await user.save({ validateBeforeSave: false });
    return response.secure_url;
  },
  updateProfile: async (_: any, { input }: UpdateProfile) => {},
};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
