import {} from "graphql";
const typeDefs = `#graphql
type Query {
    getMyProfile:User!
}
type UserProfileResponse {
  _id:ID!
  profile_info:ProfileInfo!
  social_links:SocialLinks!
  account_info:AccountInfo!
  role:Role!
  joinedAt:Date!
}

input UpdateProfileInput {
    bio:String!
    username:String!
    social_links:SocialLinks
}

type Mutation {
userProfile(username:String!):UserProfileResponse!
uploadProfileImage(file:String!):String!
updateProfile(input:UpdateProfileInput):String!
}


`;

export { typeDefs };
