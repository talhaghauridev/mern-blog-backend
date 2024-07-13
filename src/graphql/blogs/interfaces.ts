import { IBlog } from "@/models/blog.model";

type CreateBlog = {
  input: Pick<IBlog, "title" | "des" | "banner" | "content" | "tags" | "id">;
};

type AddDraft = {
  input: Required<
    Pick<IBlog, "title" | "des" | "banner" | "content" | "tags" | "id">
  >;
};

type LatestBlog = {
  input: {
    page: number;
    limit: number;
  };
};

type SearchBlogs = {
  input: {
    page: number;
    limit: number;
    query: string;
    blogId: string;
    tag: string;
    author: string;
  };
};

type GetBlog = {
  blog_id: string;
};

type LikeBlog = {
  blogId: string;
  isUserLiked: boolean;
};

type UserLiked = {
  blogId: string;
};

export type {
  AddDraft,
  CreateBlog,
  GetBlog,
  LatestBlog,
  LikeBlog,
  SearchBlogs,
  UserLiked,
};
