import { AuthenticationError, UserInputError } from "apollo-server-express";
import Blog, { IBlog } from "../../models/blog.model";
import { Context } from "../../types";
import { checkAuth } from "../../middlewares/auth.middleware";
import { CreateBlog, DeleteBlog, UpdateBlog } from "../../types/blogTypes";
import mongoose from "mongoose";
import Comment from "../../models/comment.model";

const BlogQuery = {
  getAllBlogs: async () => {
    const blogs = await Blog.find({})
      .populate({
        path: "comments",
        select: "comment user blog",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate("user");

    if (!blogs) {
      throw new AuthenticationError("Blogs not found");
    }

    return blogs;
  },
};

const BlogMutation = {
  createBlog: async (
    _: any,
    { input }: CreateBlog,
    { error, user }: Context
  ) => {
    checkAuth(error);

    const { title, description, image } = input;

    if (!title || !description || !image) {
      throw new UserInputError("Please fill all fields");
    }

    const blog = await Blog.create({
      title,
      description,
      image,
      user: user?._id,
    });

    if (!blog) {
      throw new AuthenticationError("Blog creation error");
    }

    return "Blog Created Successfully";
  },
  updateBlog: async (_: any, { id, input }: UpdateBlog, { error }: Context) => {
    checkAuth(error);

    const { title, description, image } = input;

    if (!id) {
      throw new AuthenticationError("Please provide id");
    }

    if (!title || !description || !image) {
      throw new UserInputError("Please fill all fields");
    }

    const blog = await Blog.findByIdAndUpdate(id, {
      $set: {
        title,
        description,
        image,
      },
    });

    if (!blog) {
      throw new AuthenticationError("Blog not found");
    }

    return "Blog Updated Successfully";
  },

  deleteBlog: async (_: any, { id }: DeleteBlog, { error }: Context) => {
    checkAuth(error);
    if (!id) {
      throw new UserInputError("Please provide id");
    }

    const blogId = await Blog.findById(id);

    if (!blogId) {
      throw new UserInputError("Invalid blog id");
    }
    const blog = await Blog.findByIdAndDelete(blogId._id);



    if (!blog) {
      throw new AuthenticationError("Blog not found");
    }

    // await Comment.findByIdAndDelete(blogId?._id)



    return "Blog Delete Successfully";
  },
};

export { BlogQuery, BlogMutation };
