import { ApolloServer } from "@apollo/server";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { ENV_MODE } from "@/constants/env";

const createApolloGraphgqlServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: ENV_MODE !== "PRODUCTION",
    includeStacktraceInErrorResponses: false,
  });

  await server.start();

  return server;
};
export default createApolloGraphgqlServer;
