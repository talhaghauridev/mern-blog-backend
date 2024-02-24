import { Schema, model } from "mongoose";
import { IComment } from "./comment.model";
import { IUser } from "./user.model";

export interface IBlog extends Document {
  title: string;
  description: string;
  image: string;
  comments: [Schema.Types.ObjectId | IComment];
  user: Schema.Types.ObjectId | IUser;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = model<IBlog>("Blog", blogSchema);

export default Blog;
