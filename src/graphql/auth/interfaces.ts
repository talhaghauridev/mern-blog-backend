import { UserType } from "../../types";

type LoginInput = {
  input: { email: string; password: string };
};

type SignupInput = {
  input: Pick<UserType["profile_info"], "fullName" | "email" | "password">;
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
  ChangePasswordInput,
  LoginInput,
  RefreshTokenInput,
  SignUpGoogleInput,
  SignupInput,
};
