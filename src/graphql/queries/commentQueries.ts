import { gql } from "apollo-server-express";

const commentQueries = gql`
  type Query {
    hello: String
  }
  input CommentInput {
    blogId: ID!
    comment: String!
  }

  type Mutation {
    createComment(input: CommentInput!): String!
    deleteComment(commentId: ID!): String!
  }
`;

export default commentQueries;
