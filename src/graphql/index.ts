import { ApolloServer } from "@apollo/server";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
const createApolloGraphqlServer = async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: true,
    includeStacktraceInErrorResponses: false,
  });
  await server.start();

  return server;
};

export default createApolloGraphqlServer;
