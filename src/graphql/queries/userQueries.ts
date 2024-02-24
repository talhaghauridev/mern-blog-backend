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
    createdAt: String!
    token: String
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
    password: String
  }
`;

export default userQueries;
