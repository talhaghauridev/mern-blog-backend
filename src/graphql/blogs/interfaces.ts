import { IBlog } from "../../models/blog.model";

type CreateBlog = {
  input: Pick<IBlog, "title" | "des" | "banner" | "content" | "tags">;
};

export type { CreateBlog };
