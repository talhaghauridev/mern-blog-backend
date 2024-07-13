import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    a: String
  }
`;

export { typeDefs };
