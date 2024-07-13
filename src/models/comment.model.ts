import { UserType } from "@/types";
import { Document, Schema, model, models } from "mongoose";
import { IBlog } from "./blog.model";
import { Model } from "mongoose";

export interface IComment extends Document {
  blog_id: Schema.Types.ObjectId | IBlog;
  blog_author: Schema.Types.ObjectId | IBlog;
  comment: string;
  children?: Schema.Types.ObjectId[] | IComment[];
  commented_by: Schema.Types.ObjectId | UserType;
  isReply?: boolean;
  parent?: Schema.Types.ObjectId | IComment;
  commentedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    blog_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    comment: {
      type: String,
      required: true,
    },
    children: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);

const Comment: Model<IComment> =
  models?.Comment || model<IComment>("Comment", commentSchema);

export default Comment;
