import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import User from "../models/user.model";
import { ApolloError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants";
import { Context } from "../types";

const verifyToken = async ({
  req,
}: ExpressContextFunctionArgument): Promise<Context> => {
  const authenication = req.headers.authorization || "";

  if (!authenication) {
    return { error: "Please Login to access these resources", user: null };
  }
  const token = authenication.replace("Bearer ", " ") || authenication;

  if (!token) {
    return { error: "Please Login to access these resources", user: null };
  }
  try {
    const decode = jwt.verify(token, ACCESS_TOKEN_SECRET) as { _id: string };

    const user = await User.findById(decode._id).select("-password")
    if (!user) {
      return { error: "User not found", user: null };
    }

    return { error: null, user };
  } catch (err) {
    return { error: err as string, user: null };
  }
};

const checkAuth = (error: string | null) => {
  if (error) {
    throw new ApolloError(error,"",{statusCode:403});
  }
};

export { verifyToken, checkAuth };
