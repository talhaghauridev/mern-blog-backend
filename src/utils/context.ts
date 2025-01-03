import { ExpressContextFunctionArgument } from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import ApolloError from "./ApolloError";
import { ErrorTypes } from "@/constants/ErrorTypes";
import { ACCESS_TOKEN_SECRET } from "@/constants/env";
import UserService from "@/services/user.services";
import { IUser } from "@/models/user.model";

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

const cacheUser = new Map<string, IUser>();

const verifyUser = async ({ token: authHeader }: Context): Promise<IUser> => {
  if (!authHeader) {
    return ApolloError("Token is required", ErrorTypes.BAD_USER_INPUT);
  }
  const token = authHeader.replace("Bearer ", "");

  let decoded;
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string };
    if (!decoded) {
      return ApolloError("Invalid Access Token", ErrorTypes.UNAUTHENTICATED);
    }
  } catch (error) {
    return ApolloError("Invalid Access Token", ErrorTypes.UNAUTHENTICATED);
  }

  const cachedUser = cacheUser.get(decoded.id);
  if (cachedUser) {
    return cachedUser;
  }

  const user = await UserService.findById(decoded.id).select(
    "-profile_info.password"
  );
  if (!user) {
    return ApolloError("Invalid Access Token", ErrorTypes.UNAUTHENTICATED);
  }
  if (!user.refreshToken) {
    return ApolloError(
      "User session has expired. Please log in again.",
      ErrorTypes.UNAUTHORIZED
    );
  }

  cacheUser.set((user._id as string).toString(), user);
  return user;
};

export { context, verifyUser };
