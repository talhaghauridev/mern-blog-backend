import jwt from "jsonwebtoken";
import { UserLoginType } from "@/constants/constants";
import { REFRESH_TOKEN_SECRET } from "@/constants/env";
import { ErrorTypes } from "@/constants/ErrorTypes";
import User from "@/models/user.model";
import UserService from "@/services/user.services";
import ApolloError from "@/utils/ApolloError";
import { Context, verifyUser } from "@/utils/context";
import { generateAccessAndRefreshTokens } from "@/utils/generateToken";
import getGoogleProfile from "@/utils/getGoogleProfile";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/utils";
import {
  ChangePasswordInput,
  LoginInput,
  RefreshTokenInput,
  SignUpGoogleInput,
  SignupInput,
} from "./interfaces";

const queries = {};

const mutations = {
  login: async (_: any, { input }: LoginInput) => {
    const { email, password } = input;

    if (!email || !password) {
      return ApolloError("Please fill all fields", ErrorTypes.VALIDATION_ERROR);
    }
    const user = await UserService.findByEmail(email);
    if (!user) {
      return ApolloError("Invalid Credentials", ErrorTypes.BAD_USER_INPUT);
    }
    if (user.loginType !== UserLoginType.EMAIL_PASSWORD) {
      return ApolloError(
        `Account was created with ${UserLoginType.GOOGLE}`,
        ErrorTypes.UNAUTHORIZED
      );
    }
    const isPassword = await user.isPasswordCorrect(password);
    if (!isPassword) {
      return ApolloError("Invalid Credentials", ErrorTypes.BAD_USER_INPUT);
    }

    const {
      accessToken,
      refreshToken,
      user: loggedUser,
    } = await generateAccessAndRefreshTokens(user._id as string);
    return {
      user: loggedUser,
      accessToken,
      refreshToken,
    };
  },

  signup: async (_: any, { input }: SignupInput) => {
    const { fullName, email, password } = input;
    if (!fullName || !email || !password) {
      return ApolloError("Please fill all fields", ErrorTypes.VALIDATION_ERROR);
    }
    if (!EMAIL_REGEX.test(email)) {
      return ApolloError("Email is invalid", ErrorTypes.BAD_USER_INPUT);
    }
    if (!PASSWORD_REGEX.test(password)) {
      return ApolloError(
        "Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters",
        ErrorTypes.BAD_USER_INPUT
      );
    }
    const userExist = await UserService.findByEmail(email);
    if (userExist) {
      return ApolloError("User already exists", ErrorTypes.ALREADY_EXISTS);
    }
    const username: string = email.split("@")[0];
    const newUser = await UserService.createUser({
      loginType: UserLoginType.EMAIL_PASSWORD,
      profile_info: {
        email,
        fullName,
        password,
        username,
      },
    });
    if (!newUser) {
      return ApolloError(
        "Error while creating user",
        ErrorTypes.INTERNAL_SERVER_ERROR
      );
    }
    const { accessToken, refreshToken, user } =
      await generateAccessAndRefreshTokens(newUser._id as string);
    return {
      user,
      accessToken,
      refreshToken,
    };
  },

  signUpGoogle: async (_: any, arg: SignUpGoogleInput) => {
    const incomingAccessToken: string = arg.accessToken;
    if (!incomingAccessToken) {
      return ApolloError("Access Token is required", ErrorTypes.BAD_USER_INPUT);
    }

    const data = await getGoogleProfile(incomingAccessToken);

    if (data.error) {
      return ApolloError(
        `Invalid Access Token: ${JSON.stringify(data.error)}`,
        ErrorTypes.UNAUTHORIZED
      );
    }

    if (data.user) {
      const user = await UserService.findByEmail(data.user.email);
      console.log({ user });

      if (user) {
        if (user.loginType !== UserLoginType.GOOGLE) {
          return ApolloError(
            `You have previously registered using ${user.loginType
              ?.toLowerCase()
              ?.replace("_", " ")}. Please use the ${user.loginType
              ?.toLowerCase()
              ?.replace("_", " ")} login option to access your account.`,
            ErrorTypes.UNAUTHORIZED
          );
        } else {
          const {
            accessToken,
            refreshToken,
            user: loggedUser,
          } = await generateAccessAndRefreshTokens(user._id as string);
          return { user: loggedUser, accessToken, refreshToken };
        }
      } else {
        const createdUser = await UserService.createUser({
          profile_info: {
            fullName: data.user.name!,
            email: data.user.email!,
            password: data.user.id,
            username: data.user.email.split("@")[0]!,
            profileImage: {
              url: data.user.picture!,
              public_id: "",
            },
          },
          loginType: UserLoginType.GOOGLE,
        });

        if (createdUser) {
          const { accessToken, refreshToken, user } =
            await generateAccessAndRefreshTokens(createdUser._id as string);
          return {
            user,
            accessToken,
            refreshToken,
          };
        } else {
          return ApolloError(
            "Error while registering the user",
            ErrorTypes.INTERNAL_SERVER_ERROR
          );
        }
      }
    } else {
      return ApolloError(
        "Failed to retrieve user data from Google",
        ErrorTypes.BAD_REQUEST
      );
    }
  },

  refreshAccessToken: async (_: any, arg: RefreshTokenInput) => {
    const incomingRefreshToken = arg.refreshToken;
    if (!incomingRefreshToken) {
      return ApolloError(
        "Refresh Token is required",
        ErrorTypes.VALIDATION_ERROR
      );
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      REFRESH_TOKEN_SECRET
    ) as { id: string };
    if (!decodedToken) {
      return ApolloError("Invalid Refresh Token", ErrorTypes.UNAUTHENTICATED);
    }
    const user = await UserService.findById(decodedToken.id);
    if (!user) {
      return ApolloError("Invalid Refresh Token", ErrorTypes.UNAUTHENTICATED);
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return ApolloError(
        "Refresh token is Invalid",
        ErrorTypes.UNAUTHENTICATED
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as string
    );
    return { accessToken, refreshToken };
  },
  logout: async (_: any, __: unknown, ctx: Context) => {
    const user = await verifyUser(ctx);
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          refreshToken: "",
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return ApolloError("Error removing the token ", ErrorTypes.BAD_REQUEST);
    }

    return "User logged out";
  },
  changePassword: async (
    _: any,
    { input }: ChangePasswordInput,
    ctx: Context
  ) => {
    const user = await verifyUser(ctx);
    const { oldPassword, newPassword } = input;
    if (!oldPassword || !newPassword) {
      return ApolloError("Please fill all fields", ErrorTypes.VALIDATION_ERROR);
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      return ApolloError(
        "Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters",
        ErrorTypes.BAD_USER_INPUT
      );
    }

    const isUser = await UserService.findById(user._id as string);
    if (!isUser) {
      return ApolloError("User not found", ErrorTypes.NOT_FOUND);
    }
    const isPasswordMatched = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordMatched) {
      return ApolloError(
        "Old password is incorrect ",
        ErrorTypes.BAD_USER_INPUT
      );
    }

    isUser.profile_info.password = newPassword;

    isUser.save({ validateBeforeSave: false });
    return "Password changed successfully";
  },
};

export const resolvers = { queries, mutations };
