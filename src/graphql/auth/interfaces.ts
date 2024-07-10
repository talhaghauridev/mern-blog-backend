import { IUser } from "../../models/user.model";

type LoginInput = {
  input: { email: string; password: string };
};

type SignupInput = {
  input: Pick<IUser["profile_info"], "fullName" | "email" | "password">;
};

type SignUpGoogleInput = {
  accessToken: string;
};
type RefreshTokenInput = {
  refreshToken: string;
};

type ChangePasswordInput = {
  input: {
    oldPassword: string;
    newPassword: string;
  };
};

export type {
  LoginInput,
  SignupInput,
  SignUpGoogleInput,
  RefreshTokenInput,
  ChangePasswordInput,
};
