import { mergeResolvers, ResolverModule, Resolvers } from "../utils/utils";
import Auth from "./auth";
import Users from "./users";
// import Blogs from "./blogs";

const resolverModules: ResolverModule[] = [Auth, Users];

const resolvers: Resolvers = {
  Query: mergeResolvers(resolverModules, "queries"),
  Mutation: mergeResolvers(resolverModules, "mutations"),
  ...(mergeResolvers(resolverModules, "extraResolvers") && {
    ...mergeResolvers(resolverModules, "extraResolvers"),
  }),
};

export default resolvers;
