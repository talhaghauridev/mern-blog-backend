import { gql } from "apollo-server-express";

const userQueries = gql`
  type Query {
    hello: String!
    me: User!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    avatar: Avatar!
    createdAt: String!
    token: String
  }

  type Avatar {
    url: String!
    public_id: String!
  }

  type Mutation {
    loginUser(userData: LoginInput!): User!
    signupUser(userData: SignupInput!): User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    avatar: String!
  }
`;

export default userQueries;
