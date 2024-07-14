import { Context, verifyUser } from "@/utils/context";
import { AddComment } from "./interfaces";
import ApolloError from "@/utils/ApolloError";
import { ErrorTypes } from "@/constants/ErrorTypes";
import Comment, { IComment } from "@/models/comment.model";
import Blog from "@/models/blog.model";
import Notification from "@/models/notification.model";

const queries = {
  a: () => {
    return "Hello World";
  },
};

const mutations = {
  addComment: async (_: any, { input }: AddComment, ctx: Context) => {
    const user = await verifyUser(ctx);
    const { comment, blog_author, blog_id, notification_id, replying_to } =
      input;
    if (!comment) {
      return ApolloError("Comment is required", ErrorTypes.BAD_REQUEST);
    }

    let commentObj: any = {
      blog_id,
      blog_author,
      comment,
      commented_by: user._id,
    };
    if (replying_to) {
      commentObj.parent = replying_to;
      commentObj.isRepley = true;
    }

    try {
      const newComment = await Comment.create(commentObj);

      await Blog.findOneAndUpdate(
        { _id: blog_id },
        {
          $push: { comments: newComment._id },
          $inc: {
            "activity.total_comments": 1,
            "activity.total_parent_comments": replying_to ? 0 : 1,
          },
        }
      );
      let notificationObj: any = {
        type: replying_to ? "reply" : "comment",
        blog: blog_id,
        notification_for: blog_author,
        user: user._id,
        comment: newComment._id,
      };

      if (replying_to) {
        notificationObj.replied_on_comment = replying_to;
        const replyComment = await Comment.findOneAndUpdate(
          { _id: replying_to },
          { $push: { children: newComment._id } }
        );
        notificationObj.notification_for = replyComment?.commented_by;

        if (notification_id) {
          await Notification.findOneAndUpdate(
            { _id: notification_id },
            {
              reply: newComment._id,
            }
          );
        }
      }
      const newNotification = await Notification.create(notificationObj);

      return newComment;
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
