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
    commented_by: User!
    isReply: Boolean
    parent: Comment
    commentedAt: String!
  }

  type AddCommentResponse {
    _id: ID!
    blog_id: String!
    blog_author: String!
    comment: String!
    children: [String]!
    commented_by: User!
    isReply: Boolean
    parent: String
    commentedAt: Date!
  }

  type Mutation {
    addComment:(input:AddCommentInput!):AddCommentResponse!
  }

  input AddCommentInput {
    blog_id:String!
    comment:String!
    blog_author:String!
    replying_to:String!
    notification_id:String
  }
`;

export { typeDefs };
