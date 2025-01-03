import { ErrorTypes } from "@/constants/ErrorTypes";
import Blog from "@/models/blog.model";
import User from "@/models/user.model";
import ApolloError from "@/utils/ApolloError";
import { removeFromCloudinary, uploadCloudinary } from "@/utils/cloudinary";
import { Context, verifyUser } from "@/utils/context";
import { rateLimitedResolver } from "@/utils/rate-limiter";
import {
  extractFields,
  isBase64Image,
  validateSocialLinks,
} from "@/utils/utils";
import {
  GetUserBlogs,
  SearchUsers,
  UpdateProfile,
  UploadProfileImage,
  UserProfileInput,
} from "./interfaces";

const queries = {
  getMyProfile: rateLimitedResolver(
    async (_: any, args: any, ctx: Context, info: any) => {
      const user = await verifyUser(ctx);
      return user;
    }
  ),
  searchUsers: async (_: any, { input }: SearchUsers) => {
    const { query = "", limit = 20 } = input;
    try {
      const users = await User.find({
        "profile_info.username": new RegExp(query, "i"),
      })
        .limit(limit)
        .select(
          "profile_info.username profile_info.fullName profile_info.profileImage profile_info.bio social_links"
        );

      return users.map((user) => {
        const { profile_info, social_links, _id } = user.toObject();
        return {
          ...profile_info,
          social_links,
          _id,
        };
      });
    } catch (error: any) {
      return ApolloError(
        `Find Users Error: ${error.message}`,
        ErrorTypes.BAD_REQUEST
      );
    }
  },
  getUserBlogs: async (
    _: any,
    { input }: GetUserBlogs,
    ctx: Context,
    info: any
  ) => {
    const user = await verifyUser(ctx);
    const fields = extractFields(info);
    const { page = 1, draft, query, limit = 5, deletedDocCount } = input;
    let skip = (page - 1) * limit;
    if (deletedDocCount) {
      skip -= deletedDocCount;
    }
    try {
      const blogs = await Blog.find({
        author: user._id,
        draft,
        title: new RegExp(query, "i"),
      })
        .skip(skip)
        .limit(limit)
        .select("-draft -_id");

      if (fields.includes("count")) {
        const count = await Blog.countDocuments({
          author: user._id,
          draft,
          title: new RegExp(query, "i"),
        });
        return { blogs, count };
      }

      return { blogs };
    } catch (error: any) {
      return ApolloError(
        `Get User Blogs Error: ${error.message}`,
        ErrorTypes.BAD_REQUEST
      );
    }
  },
};

const mutations = {
  userProfile: async (_: any, { username }: UserProfileInput) => {
    if (!username) {
      return ApolloError(
        "Please provide a username",
        ErrorTypes.BAD_USER_INPUT
      );
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
    { file }: UploadProfileImage,
    ctx: Context
  ) => {
    const user = await verifyUser(ctx);
    if (!file) {
      return ApolloError("No file provided", ErrorTypes.BAD_USER_INPUT);
    }
    if (!isBase64Image(file)) {
      return ApolloError("Invalid file", ErrorTypes.BAD_USER_INPUT);
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
    await user.save({ validateBeforeSave: false });
    return "Profile updated successfully";
  },
};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
