import { expressMiddleware } from "@apollo/server/express4";
import app from "./app";
import { ENV_MODE, PORT } from "./constants/env";
import connectDB from "./db";
import createApolloGraphqlServer from "./graphql";
import { context } from "./utils/context";

const init = async () => {
  const server = await createApolloGraphqlServer();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context,
    })
  );

  app.listen(PORT, () =>
    console.log(
      `Server is running in http://localhost:${PORT} in ${ENV_MODE} Mode `
    )
  );
};

init().then(async () => {
  await connectDB();
});
