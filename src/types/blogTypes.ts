import { IBlog } from "../models/blog.model";
import { IComment } from "../models/comment.model";

type CreateBlog = {
  input: IBlog;
};

type UpdateBlog = CreateBlog & {
  id: string;
};

type DeleteBlog = {
  id: string;
};

type CreateComment = IComment & {
  blogId: string;
  comment: string;
};

type DeleteCommet = {
  commentId: string;
};
export type { CreateBlog, UpdateBlog, DeleteBlog, CreateComment, DeleteCommet };
