import { CreateComment, DeleteCommet } from "../../types/blogTypes";
import { checkAuth } from "../../middlewares/auth.middleware";
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

    const blogComment: any = await Comment.findOne({
      blog: blogId,
      user: user?._id,
    });

    if (blogComment) {
      blogComment.comment = comment;

      await blogComment.save({ validateBeforeSave: false });
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
              comments: newComment._id,
            },
          },
          { new: true }
        );

        if (!updatedBlog) {
          throw new AuthenticationError("Blog not found");
        }
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
