import { ErrorTypes } from "../../constants/ErrorTypes";
import Blog from "../../models/blog.model";
import User from "../../models/user.model";
import ApolloError from "../../utils/ApolloError";
import { Context, verifyUser } from "../../utils/context";
import { CreateBlog } from "./interfaces";

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
    const blog = await Blog.create({
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
    await User.findByIdAndUpdate(user._id, {
      $inc: { "account_info.total_posts": 1 },
      $push: { blogs: blog._id },
    });
    return "Blog created successfully";
  },
  // addDraft: async (_: any, { input }: CreateBlog, ctx: Context) => {
  //   const user = verifyUser(ctx);
  // },
};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
