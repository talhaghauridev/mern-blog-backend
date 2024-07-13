import { mergeResolvers, ResolverModule, Resolvers } from "../utils/utils";
import Auth from "./auth";
import Users from "./users";
import Blogs from "./blogs";
import Notifications from "./notifications";
import Comments from "./comments";
import Admin from "./admin";

const resolverModules: ResolverModule[] = [
  Auth,
  Users,
  Blogs,
  Notifications,
  Comments,
  Admin,
];

const resolvers: Resolvers = {
  Query: mergeResolvers(resolverModules, "queries"),
  Mutation: mergeResolvers(resolverModules, "mutations"),
  ...(mergeResolvers(resolverModules, "extraResolvers") && {
    ...mergeResolvers(resolverModules, "extraResolvers"),
  }),
};

export default resolvers;
