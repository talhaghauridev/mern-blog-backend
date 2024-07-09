interface LoginInput {
  input: { email: string; password: string };
}

interface SignupInput {
  input: {
    fullName: string;
    email: string;
    password: string;
  };
}

interface SignUpGoogleInput {
  accessToken: string;
}
interface RefreshTokenInput {
  refreshToken: string;
}

export type { LoginInput, SignupInput, SignUpGoogleInput, RefreshTokenInput };
