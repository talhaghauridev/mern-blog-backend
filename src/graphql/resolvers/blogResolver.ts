import { Resolvers } from "../../types";
import { BlogMutation, BlogQuery } from "../services/blogService";

const BlogResolver: Resolvers = {
  Query: BlogQuery,
  Mutation: BlogMutation,
};

export default BlogResolver