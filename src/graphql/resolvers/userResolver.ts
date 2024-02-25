import { UserMutation, UserQuery } from "../services/userService";
import { Resolvers } from "../../types";

const UserResolver: Resolvers = {
  Query: UserQuery,
  Mutation: UserMutation,
};

export default UserResolver;
