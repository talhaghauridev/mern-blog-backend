import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    hello: String!
    a: Boolean
  }

  #   type Mutation {

  #   }
`;

export { typeDefs };
