import "module-alias/register";
import createApolloGraphqlServer from "@/graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { ENV_MODE, PORT } from "@/constants/env";
import app from "@/app";
import { context } from "@/utils/context";
import connectDB from "@/db";

const init = async () => {
  const server = await createApolloGraphqlServer();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: context,
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
