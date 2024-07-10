import { ErrorTypes } from "../../constants/ErrorTypes";
import User from "../../models/user.model";
import ApolloError from "../../utils/ApolloError";
import { removeFromCloudinary, uploadCloudinary } from "../../utils/cloudinary";
import { Context, verifyUser } from "../../utils/context";
import { isHttpsUrl, validateSocialLinks } from "../../utils/utils";
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

  updateProfile: async (_: any, { input }: UpdateProfile, ctx: Context) => {
    const user = await verifyUser(ctx);
    const { username, bio, social_links } = input;
    if (!username || !bio) {
      return ApolloError("Please fill all fields", ErrorTypes.VALIDATION_ERROR);
    }

    if (username.length < 3) {
      return ApolloError(
        "Username should be at least 3 letters long",
        ErrorTypes.BAD_USER_INPUT
      );
    }
    const existingUser = await User.findOne({
      "profile_info.username": username,
      _id: { $ne: user._id },
    });
    if (existingUser) {
      return ApolloError(
        "Username is already taken",
        ErrorTypes.ALREADY_EXISTS
      );
    }

    const isEditLinks = Object.values(social_links).some(
      (link) => link !== undefined && link !== null && link !== ""
    );
    if (isEditLinks) {
      const validationResult = validateSocialLinks(social_links);
      if (validationResult) {
        return ApolloError(validationResult.message, ErrorTypes.BAD_USER_INPUT);
      }
      user.social_links = social_links;
    }

    user.profile_info.bio = bio;
    user.profile_info.username = username;
    user.save({ validateBeforeSave: false });
    return "Profile updated successfully";
  },
};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
