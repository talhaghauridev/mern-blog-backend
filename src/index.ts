import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import app from "./app";
import { verifyToken } from "./middlewares/auth.middleware";
import typeDefs from "./graphql/queries/index";
import resolvers from "./graphql/resolvers/index";
import connectDB from "./db";
import { PORT } from "./constants";

const init = async (): Promise<void> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server, { context: verifyToken }));

  app.listen(PORT, () => {
    console.log(`Server is running in port http://localhost:${PORT}`);
  });
};

connectDB().then(() => {
  init();
});

export default app;
