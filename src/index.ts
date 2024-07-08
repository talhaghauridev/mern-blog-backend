import { expressMiddleware } from "@apollo/server/express4";
import app from "./app";
import { verifyToken } from "./middlewares/auth.middleware";
import connectDB from "./db";
import { PORT } from "./constants";
import createApolloGraphgqlServer from "./graphql";

const init = async (): Promise<void> => {
  const server = await createApolloGraphgqlServer();

  app.use("/graphql", expressMiddleware(server, { context: verifyToken }));

  app.listen(PORT, () => {
    console.log(`Server is running in port http://localhost:${PORT}`);
  });
};

app.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Server is running fine".repeat(300),
  });
});

// connectDB().then(() => {
//   init();
// });
init();

export default app;
