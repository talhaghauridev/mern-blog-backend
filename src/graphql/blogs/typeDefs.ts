import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date

  type Query {
    latestBlogs(input: LatestBlogsInput): LatestBlogResult!
    trendingBlogs: [Blog]!
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
    createdAt: Date!
    updatedAt: Date!
  }

  type Mutation {
    createBlog(input: CreateBlogInput!): String!
  }

  input LatestBlogsInput {
    page: Int!
    limit: Int
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
