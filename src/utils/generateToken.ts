import jwt from "jsonwebtoken";
import ApiError from "./ApiError";
import UserService from "../services/user.services";
import { IUser } from "../models/user.model";

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = (await UserService.findById(userId)) as IUser;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

export { generateAccessAndRefreshTokens };
