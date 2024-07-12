import { IBlog } from "@/models/blog.model";

type CreateBlog = {
  input: Pick<IBlog, "title" | "des" | "banner" | "content" | "tags">;
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

export type { CreateBlog, AddDraft, LatestBlog };
