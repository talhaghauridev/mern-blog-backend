import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date

  type Query {
    latestBlogs(input: LatestBlogsInput): LatestBlogResult!
    searchBlogs(input: SearchBlogInput): LatestBlogResult!
    trendingBlogs: [Blog]!
    getBlog(blog_id: String!): Blog!
  }

  type LatestBlogResult {
    blogs: [Blog]!
    count: Int!
  }
  type BlogActivity {
    total_likes: Int!
    total_comments: Int!
    total_reads: Int!
    total_parent_comments: Int!
  }
  type Author {
    _id: ID!
    profile_info: ProfileInfo!
    social_links: SocialLinks!
    account_info: AccountInfo!
    joinedAt: Date!
  }

  type Blog {
    _id: ID!
    blog_id: String
    title: String
    banner: String
    des: String
    content: [String]!
    tags: [String]!
    author: Author!
    activity: BlogActivity!
    comments: [String]!
    draft: Boolean!
    publishedAt: Date!
    updatedAt: Date!
  }

  type Mutation {
    createBlog(input: CreateBlogInput!): String!
    createDraftBlog(input: CreateBlogInput): String!
    likeBlog(blogId: String!, isUserLiked: Boolean!): Boolean!
    isUserLiked(blogId: String!): Boolean!
    deleteBlog(blogId: String!): String!
  }

  input SearchBlogInput {
    tag: String
    query: String
    author: String
    page: Int
    limit: Int
    blogId: String!
  }

  input LatestBlogsInput {
    page: Int!
    limit: Int
  }

  input CreateBlogInput {
    id: ID
    title: String!
    banner: String
    des: String
    content: [String]
    tags: [String]
  }
`;

export { typeDefs };
