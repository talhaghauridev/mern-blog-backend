import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    a: String
  }

  type Comment {
    _id: ID!
    blog_id: Blog!
    blog_author: Blog!
    comment: String!
    children: [Comment]
    commentedBy: User!
    isReply: Boolean
    parent: Comment
    commentedAt: String!
  }
`;

export { typeDefs };
