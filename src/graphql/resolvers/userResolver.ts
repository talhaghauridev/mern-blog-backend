import { Resolvers } from "../../types";
import { UserMutation, UserQuery } from "../services/userService";

const UserResolver: Resolvers = {
  Query: UserQuery,
  Mutation: UserMutation,
};

export default UserResolver;
