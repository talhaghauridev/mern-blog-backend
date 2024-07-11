import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type BlogActivity {
    total_likes: Int!
    total_comments: Int!
    total_reads: Int!
    total_parent_comments: Int!
  }

  type Blog {
    blog_id: String
    title: String
    banner: String
    des: String
    content: [String]!
    tags: [String]!
    author: UserProfileResponse
    activity: BlogActivity!
    comments: [String]!
    draft: Boolean!
    publishedAt: Date!
    createdAt: Date!
    updatedAt: Date!
  }

  type Mutation {
    createBlog(input: CreateBlogInput!): String!
    # addDraft:():String!
  }

  input CreateBlogInput {
    title: String
    banner: String
    des: String
    content: [String]!
    tags: [String]!
    draft: Boolean!
  }
`;

export { typeDefs };
