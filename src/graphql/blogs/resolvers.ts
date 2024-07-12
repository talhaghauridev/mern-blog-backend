import { ErrorTypes } from "@/constants/ErrorTypes";
import Blog from "@/models/blog.model";
import User from "@/models/user.model";
import ApolloError from "@/utils/ApolloError";
import { Context, verifyUser } from "@/utils/context";
import { AddDraft, CreateBlog } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
const queries = {
  hello: () => {
    return "Hello World";
  },
};

const mutations = {
  createBlog: async (_: any, { input }: CreateBlog, ctx: Context) => {
    const user = await verifyUser(ctx);
    const { title, des, content, tags, banner } = input;

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
  },

  // addDraft: async (_: any, { input }: AddDraft, ctx: Context) => {
  //   const user = verifyUser(ctx);
  //   const { title, des, content, tags, banner, id } = input;
  //   if (!id) {
  //     return ApolloError("Id is required", ErrorTypes.VALIDATION_ERROR);
  //   }
  // },
};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
