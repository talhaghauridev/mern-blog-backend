import { IBlog } from "../models/blog.model";

type CreateBlog = {
  input: IBlog;
};

type BlogDetials ={
  id:string
}

type UpdateBlog = CreateBlog & {
  id: string;
};

type DeleteBlog = {
  id: string;
};

type CreateComment = {
  blogId: string;
  comment: string;
};

type DeleteCommet = {
  commentId: string;
};



export type { CreateBlog, UpdateBlog, DeleteBlog, CreateComment, DeleteCommet,BlogDetials };
