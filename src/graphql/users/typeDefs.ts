import { gql } from "apollo-server-express";
const typeDefs = gql`
  scalar Date
  type Query {
    getMyProfile: User!
  }

  type UserProfileResponse {
    _id: ID!
    profile_info: ProfileInfo!
    social_links: SocialLinks!
    account_info: AccountInfo!
    role: Role!
    joinedAt: Date!
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

  type Mutation {
    userProfile(username: String!): UserProfileResponse!
    uploadProfileImage(file: String!): String!
    updateProfile(input: UpdateProfileInput): String!
  }
`;

export { typeDefs };
