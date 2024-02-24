import { Resolvers } from "../../types";
import { CommentMutation, CommentQuery } from "../services/commentService";

const CommentResolver: Resolvers = {
  Query: CommentQuery,
  Mutation: CommentMutation,
};

export default CommentResolver;