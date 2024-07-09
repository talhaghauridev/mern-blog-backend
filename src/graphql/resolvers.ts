import Auth from "./auth";
import Blog from "./blog";

const resolvers = {
  Query: {
    ...{ ...Blog.resolvers.queries },
  },
  Mutation: {
    // ...Blog.resolvers.mutations,
    ...{ ...Auth.resolvers.mutations },
  },
  // ...Blog.resolvers.extraResolvers,
};

export default resolvers;
