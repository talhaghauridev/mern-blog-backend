import { ApolloServer, BaseContext } from "@apollo/server";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const createApolloGraphgqlServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    includeStacktraceInErrorResponses: false, //to exclude stackTrace parameter from error messages
  });

  await server.start();

  return server;
};
export default createApolloGraphgqlServer;
