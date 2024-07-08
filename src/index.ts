import { expressMiddleware } from "@apollo/server/express4";
import app from "./app";
import { ENV_MODE, PORT } from "./constants/env";
import createApolloGraphqlServer from "./graphql";
import connectDB from "./db";
import { AvailableSocialLogins } from "./constants/constants";

const init = async () => {
  const server = await createApolloGraphqlServer();

  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () =>
    console.log(
      `Server is running in http://localhost:${PORT} in ${ENV_MODE} Mode `
    )
  );
};

init().then(async () => {
  await connectDB();
});
