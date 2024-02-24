import { checkAuth } from "../../middlewares/auth.middleware";
import { CreateComment, DeleteCommet } from "../../types/blogTypes";
import { Context } from "../../types";
import Comment, { IComment } from "../../models/comment.model";
import { AuthenticationError } from "apollo-server-express";
import Blog from "../../models/blog.model";

const CommentQuery = {
  hello: (_: any, {}) => {
    return "Hello";
  },
};

const CommentMutation = {
  createComment: async (
    _: any,
    { input }: { input: CreateComment },
    { error, user }: Context
  ) => {
    checkAuth(error);
    const { comment, blogId } = input;
    const blog = await Blog.findById(blogId).populate({
      path: "comments",
      select: "comment user",
    });

    if (!blog) {
      throw new AuthenticationError("Blog not found");
    }
    const existingComment = blog.comments.find(
      (item: any) => item.user.toString() == user?._id.toString()
    );

    if (existingComment) {
      blog.comments.forEach((b: any) => {
        if (b.user.toString() === user?._id?.toString()) {
          b.comment = comment;
        }
      });
      await blog.save({ validateBeforeSave: false });
      return "Comment created successfully";
    } else {
      try {
        const newComment = await Comment.create({
          comment,
          user: user?._id,
          blog: blogId,
        });

        const updatedBlog = await Blog.findByIdAndUpdate(
          blogId,
          {
            $push: {
              comment: newComment._id,
            },
          },
          { new: true }
        );

        if (!updatedBlog) {
          throw new AuthenticationError("Blog not found");
        }
        await blog.save({ validateBeforeSave: false });

        return "Comment created successfully";
      } catch (err) {
        throw new AuthenticationError(err as string);
      }
    }
  },

  deleteComment: async (
    _: any,
    { commentId }: DeleteCommet,
    { error }: Context
  ) => {
    checkAuth(error);
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      throw new AuthenticationError("Comment not found");
    }

    await Blog.findByIdAndUpdate(commentId, {
      $pull: {
        comments: commentId,
      },
    });

    return "Comment delete successfully";
  },
};

export { CommentQuery, CommentMutation };
