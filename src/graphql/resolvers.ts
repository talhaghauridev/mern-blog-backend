import Blog from "./blog";
import User from "./user";

const resolvers = {
  Query: {
    ...{ ...Blog.resolvers.queries },
    ...{ ...User.resolvers.queries },
  },
  Mutation: {
    // ...Blog.resolvers.mutations,
    ...{ ...User.resolvers.mutations },
  },
  // ...Blog.resolvers.extraResolvers,
};

export default resolvers;
