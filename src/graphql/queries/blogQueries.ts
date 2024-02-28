import { gql } from "apollo-server-express";

const blogQueries = gql`
  type Query {
    getAllBlogs: [Blog]!
    getBlogDetials(id:ID!):Blog!
  }

  type Comment {
    _id: ID!
    comment: String!
    user: User!
    blog:ID!
  }

  type Blog {
    _id: ID!
    title: String!
    description: String!
    image: String!
    createdAt: String!
    comments: [Comment]!
    user: User!
  }

  type Mutation {
    createBlog(input: BlogInput!): String!
    updateBlog(id: ID!, input: BlogInput!): String!
    deleteBlog(id: ID!): String!
  }

  input BlogInput {
    title: String!
    description: String!
    image: String!
  }
`;

export default blogQueries;
