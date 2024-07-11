import mongoose, { Document, Model, model, Schema } from "mongoose";

export interface IBlog extends Document {
  blog_id: string;
  title: string;
  banner?: string;
  des?: string;
  content: any[];
  tags?: string[];
  author: mongoose.Types.ObjectId;
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  comments?: mongoose.Types.ObjectId[];
  draft: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    blog_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    des: {
      type: String,
      maxlength: 200,
      required: true,
    },
    content: {
      type: [Schema.Types.Mixed] as any,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    draft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
      updatedAt: true,
    },
  }
);

const Blog: Model<IBlog> = model("Blog", blogSchema);

export default Blog;
