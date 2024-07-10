const typeDefs = `#graphql
scalar Date
  type Query {
    getUser:String
  }

  enum Role {
    USER 
    ADMIN
  } 
  enum LoginType {
   GOOGLE
   EMAIL_PASSWORD
  }

  type ProfileImage {
    url:String!
    public_id:String
  }
  type ProfileInfo {
    fullName:String!
   email:String!
   username:String!
   password:String
   bio:String
   profileImage:ProfileImage!
  }

  type SocialLinks {
    youtube: String
    instagram: String
    facebook: String
    twitter: String
    github: String
    website: String
  },
  type AccountInfo { 
    total_posts: Int!
    total_reads: Int!
    },


type User {
  _id:ID!
  profile_info:ProfileInfo!
  social_links:SocialLinks!
  account_info:AccountInfo!
  role:Role!
  loginType:LoginType!
  blogs:[String]!
  refreshToken:String
  joinedAt:Date!
  updatedAt:Date!
}

type RefreshToken {
    refreshToken:String!
    accessToken:String!
  }
type AuthUserResponse  {
  user:User!
  refreshToken:String!
  accessToken:String!
}

input LoginInput  {
  email:String!
  password:String!
}

input SignupInput{
  fullName:String!
  email:String!
  password:String!
}

input ChangePasswordInput {
 oldPassword:String!
 newPassword:String!
 confirmPassword:String!
}
  type Mutation {
    refreshAccessToken(refreshToken:String!):RefreshToken!
    signUpGoogle(accessToken: String!): AuthUserResponse!
    login(input:LoginInput!):AuthUserResponse!
    signup(input:SignupInput!):AuthUserResponse!
    changePassword(input:ChangePasswordInput!):String!
    logout:String!
  }

`;

export { typeDefs };
