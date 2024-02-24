import { AuthenticationError } from "apollo-server-express";
import { IUser } from "../models/user.model";

interface Todo {
  id: string;
  title: string;
  description: string;
  // Add other properties as needed
}

type Resolvers = {
  Query?: any ;
  Mutation?: any;
}

type Context = {
  user?: IUser | null;
  error: string | null;
};


type AccessTokenResponse ={
    accessToken:string;
    loggedUser:IUser
}

export type { Todo, Resolvers, Context,AccessTokenResponse };
