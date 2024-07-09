import jwt from "jsonwebtoken";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm//express4";
import ApolloError from "./ApolloError";
import { ErrorTypes } from "../constants/ErrorTypes";
import { ACCESS_TOKEN_SECRET } from "../constants/env";
import UserService from "../services/user.services";
import { IUser } from "../models/user.model";

export type Context = ExpressContextFunctionArgument & {
  token: string;
};

const context = async ({ req, res }: ExpressContextFunctionArgument) => {
  const token = req.headers.authorization || "";

  return {
    token,
    req,
    res,
  };
};

const cacheUser = new Map();
const verifyUser = async ({ token }: Context) => {
  if (!token) {
    return ApolloError("Token is required", ErrorTypes.BAD_USER_INPUT);
  }

  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string };
  if (!decoded) {
    return ApolloError("Invalid Access Token", ErrorTypes.UNAUTHENTICATED);
  }

  const cachedUser = cacheUser.get(decoded.id);
  if (cachedUser) {
    return cachedUser;
  }

  const user = (await UserService.findById(decoded.id)) as IUser;
  if (!user) {
    return ApolloError("Invalid Access Token", ErrorTypes.UNAUTHENTICATED);
  }

  cacheUser.set(user._id, user);
  return user;
};

export { context, verifyUser };
