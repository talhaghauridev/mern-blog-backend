import Blog from "./blog";

const resolvers = {
  Query: {
    ...{ ...Blog.resolvers.queries },
  },
  // Mutation: {
  //   ...Blog.resolvers.mutations,
  // },
  // ...Blog.resolvers.extraResolvers,
};

export default resolvers;
