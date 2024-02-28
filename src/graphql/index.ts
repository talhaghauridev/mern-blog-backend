import { ApolloServer, BaseContext } from "@apollo/server";
import typeDefs from "./queries/index";
import resolvers from "./resolvers/index";

type ApolloServerReturn = Promise<ApolloServer<BaseContext>>;

const createApolloGraphgqlServer = async (): ApolloServerReturn => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  return server;
};
export default createApolloGraphgqlServer;
