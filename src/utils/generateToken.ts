import { IUser } from "@/models/user.model";
import UserService from "@/services/user.services";
import ApiError from "./ApiError";

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = (await UserService.findById(userId).select(
      "-profile_info.password"
    )) as IUser;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken, user };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

export { generateAccessAndRefreshTokens };
