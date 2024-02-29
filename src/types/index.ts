import { IUser } from "../models/user.model";

type Resolvers = {
  Query?: any;
  Mutation?: any;
};

type Context = {
  user?: IUser | null;
  error: string | null;
};

type AccessTokenResponse = {
  accessToken: string;
  loggedUser: IUser;
};

type ImageType = {
  url: string;
  public_id: string;
};

export type { Resolvers, Context, AccessTokenResponse, ImageType };
