import { ErrorTypes } from "@/constants/ErrorTypes";
import Blog, { IBlog } from "@/models/blog.model";
import User from "@/models/user.model";
import ApolloError from "@/utils/ApolloError";
import { Context, verifyUser } from "@/utils/context";
import { v4 as uuidv4 } from "uuid";
import { extractFields, findInfoField } from "@/utils/utils";
import { Info, UserType } from "@/types";
import { FilterQuery } from "mongoose";
import Notification from "@/models/notification.model";
import { UserNotificationEnum } from "@/constants/constants";
import Comment from "@/models/comment.model";
import {
  AddDraft,
  CreateBlog,
  GetBlog,
  LatestBlog,
  LikeBlog,
  SearchBlogs,
  UserLiked,
} from "./interfaces";

export const authFunction = (resolver: any) => {
  return async (parent: any, args: any, context: Context, info: Info) => {
    const user = await verifyUser(context);
    return resolver(parent, args, user, info);
  };
};

const queries = {
  latestBlogs: async (_: any, { input }: LatestBlog, __: any, info: Info) => {
    const fields = extractFields(info);

    const { page = 1, limit = 5 } = input;
    const skip = (page - 1) * limit;

    try {
      const blogQuery = Blog.find({ draft: false });
      if (fields.some((i) => i.startsWith("blogs.author"))) {
        blogQuery.populate({
          path: "author",
          model: "User",
          select:
            "profile_info.profileImage profile_info.username profile_info.email profile_info.fullName joinedAt social_links account_info",
        });
      }

      const blogs = await blogQuery
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      console.log(fields);

      if (fields.includes("count")) {
        const count = await Blog.countDocuments({ draft: false });
        return { count, blogs };
      }

      return { blogs };
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
  trendingBlogs: async (_: any, __: any, ___: any, info: Info) => {
    const fields = extractFields(info);
    try {
      const blogQuery = Blog.find({ draft: false });
      if (fields.some((i) => i.startsWith("author"))) {
        blogQuery.populate({
          path: "author",
          model: "User",
          select:
            "profile_info.profileImage profile_info.username profile_info.email profile_info.fullName joinedAt social_links account_info",
        });
      }

      const blogs = await blogQuery
        .sort({
          "activity.total_reads": -1,
          "activity.total_likes": -1,
          publishedAt: -1,
        })
        .limit(5)
        .exec();
      console.log(blogs);

      return blogs;
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
  searchBlogs: async (_: any, { input }: SearchBlogs, __: any, info: Info) => {
    const fields = extractFields(info);
    const { page = 1, limit = 4, query, author, tag, blogId } = input;
    const skip = (page - 1) * limit;
    let findQuery: FilterQuery<IBlog> = { draft: false };
    if (tag) {
      findQuery = {
        tags: tag,
        blog_id: { $ne: blogId },
      };
    } else if (query) {
      findQuery = { title: new RegExp(query, "i") };
    } else if (author) {
      findQuery = { author };
    }
    console.log({ findQuery });

    try {
      const blogQuery = Blog.find(findQuery);
      if (findInfoField(fields, "blogs.author")) {
        blogQuery.populate({
          path: "author",
          model: "User",
          select:
            "profile_info.profileImage profile_info.username profile_info.email profile_info.fullName joinedAt social_links account_info",
        });
      }

      const blogs = await blogQuery
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);

      if (fields.includes("count")) {
        const count = await blogQuery.countDocuments();
        return {
          count,
          blogs,
        };
      }
      return { blogs };
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
  getBlog: async (_: any, { blog_id }: GetBlog, __: any, info: Info) => {
    const fields = extractFields(info);
    if (!blog_id) {
      return ApolloError("Blog Id is required", ErrorTypes.BAD_USER_INPUT);
    }

    try {
      const blog = await Blog.findOneAndUpdate(
        { blog_id },
        { $inc: { "activity.total_reads": 1 } }
      ).populate({
        path: "author",
        model: "User",
        select:
          "profile_info.profileImage profile_info.username profile_info.email profile_info.fullName joinedAt social_links account_info",
      });

      if (!blog) {
        return ApolloError("Blog not found", ErrorTypes.NOT_FOUND);
      }

      await User.findOneAndUpdate(
        {
          "profile_info.username": (blog.author as UserType).profile_info
            .username,
        },
        {
          $inc: { "account_info.total_reads": 1 },
        }
      );
      return blog;
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
};

const mutations = {
  createBlog: async (_: any, { input }: CreateBlog, ctx: Context) => {
    const user = await verifyUser(ctx);
    const { title, des, content, tags, banner, id } = input;

    if (!title || !des || !content.length || !tags || !tags.length || !banner) {
      return ApolloError("Please fill all fields", ErrorTypes.VALIDATION_ERROR);
    }
    if (tags.length > 10) {
      return ApolloError(
        "Provide tags in order to publish the blog, Maximum 10",
        ErrorTypes.BAD_USER_INPUT
      );
    }
    const blog_id =
      title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .trim() + uuidv4();
    try {
      if (id) {
        const blog = await Blog.findOneAndUpdate(
          { _id: id },
          { title, des, banner, content, tags, draft: false }
        );
        return "Blog Update Successfully successfully";
      } else {
        const blog = await Blog.create({
          blog_id,
          title,
          des,
          content,
          tags,
          banner,
          draft: false,
          author: user._id,
        });

        if (!blog) {
          return ApolloError(`Creating Blog Error`, ErrorTypes.BAD_REQUEST);
        }
        await User.findOneAndUpdate(
          { _id: user._id },
          {
            $inc: { "account_info.total_posts": 1 },
            $push: { blogs: blog._id },
          }
        );
        return "Blog created successfully";
      }
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },

  createDraftBlog: async (_: any, { input }: AddDraft, ctx: Context) => {
    const user = await verifyUser(ctx);
    const { title } = input;
    if (!title) {
      return ApolloError(
        "You must provide a title to publish the blog",
        ErrorTypes.BAD_USER_INPUT
      );
    }
    const blog_id =
      title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .trim() + uuidv4();
    try {
      const blog = new Blog({
        ...input,
        title,
        blog_id,
        draft: true,
        author: user._id,
      });
      await blog.save({ validateBeforeSave: false });
      if (!blog) {
        return ApolloError("Draft blog create error", ErrorTypes.BAD_REQUEST);
      }
      return "Draft blog created successfully";
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },

  likeBlog: async (_: any, { blogId, isUserLiked }: LikeBlog, ctx: Context) => {
    const user = await verifyUser(ctx);
    if (!blogId) {
      return ApolloError("Please provide a blog id", ErrorTypes.BAD_USER_INPUT);
    }
    const incrementValue = isUserLiked ? 1 : -1;

    try {
      const blog = await Blog.findOneAndUpdate(
        { _id: blogId },
        { $inc: { "activity.total_likes": incrementValue } }
      );

      if (isUserLiked) {
        await Notification.create({
          type: UserNotificationEnum.LIKE,
          blog: blogId,
          notification_for: blog?.author,
          user: user._id,
        });
        return true;
      } else {
        await Notification.findOneAndDelete({
          user: user._id,
          blog: blogId,
          type: UserNotificationEnum.LIKE,
        });
        return false;
      }
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
  isUserLiked: async (_: any, { blogId }: UserLiked, ctx: Context) => {
    const user = await verifyUser(ctx);
    try {
      const notification = await Notification.exists({
        user: user._id,
        type: UserNotificationEnum.LIKE,
        blog: blogId,
      });

      return notification ? true : false;
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.BAD_REQUEST);
    }
  },
  deleteBlog: async (_: any, { blogId }: UserLiked, ctx: Context) => {
    const user = await verifyUser(ctx);

    try {
      await Blog.findOneAndDelete({ _id: blogId });

      await Promise.all([
        Notification.deleteMany({ blog: blogId }),
        Comment.deleteMany({ blog_id: blogId }),
      ]);

      await User.findOneAndUpdate(
        { _id: blogId },
        {
          $pull: { blogs: blogId },
          $inc: { "account_info.total_posts": -1 },
        }
      );
      return "Blog Deleted Successfully";
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
