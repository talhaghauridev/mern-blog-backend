// comment.model.ts
import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  user: Schema.Types.ObjectId;
  comment: string;
  blog: Schema.Types.ObjectId; // Ensure that the blog field is of type ObjectId
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
