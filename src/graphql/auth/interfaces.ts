type LoginInput = {
  input: { email: string; password: string };
};

type SignupInput = {
  input: {
    fullName: string;
    email: string;
    password: string;
  };
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
