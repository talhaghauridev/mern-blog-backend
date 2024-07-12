import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date
  type Query {
    getMyProfile: User!
    searchUsers(input: SearchUsersInput!): [SearchUsersResponse]!
    getUserBlogs(input: GetUserBlogsInput!): UserBlogsResult!
  }

  # Types
  type SearchUsersResponse {
    fullName: String!
    username: String!
    profile_image: ProfileImage!
    social_links: SocialLinks!
    bio: String
  }

  type UserProfileResponse {
    _id: ID!
    profile_info: ProfileInfo!
    social_links: SocialLinks!
    account_info: AccountInfo!
    role: Role!
    joinedAt: Date!
  }

  type UserBlogsResult {
    blogs: [Blog]!
    count: Int!
  }

  #  Mutations
  type Mutation {
    userProfile(username: String!): UserProfileResponse!
    uploadProfileImage(file: String!): String!
    updateProfile(input: UpdateProfileInput): String!
  }

  # Inputs
  input GetUserBlogsInput {
    query: String!
    page: Int!
    draft: Boolean!
    deletedDocCount: Int
    limit: Int
  }
  input SearchUsersInput {
    query: String!
    limit: Int
  }

  input UpdateProfileInput {
    bio: String!
    username: String!
    social_links: SocialLinksInput
  }

  input SocialLinksInput {
    youtube: String
    instagram: String
    facebook: String
    twitter: String
    github: String
    website: String
  }
`;

export { typeDefs };
