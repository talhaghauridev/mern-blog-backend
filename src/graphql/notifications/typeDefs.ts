import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    newNotifications: Boolean!
    notifications(input: NotificationInput!): NotificationResponse!
  }

  type NotificationResponse {
    notifications: [Notification]!
    count: Int!
  }
  input NotificationInput {
    page: Int!
    filter: String!
    deletedDocCount: Int!
    limit: Int
  }

  type NotificationBlog {
    _id: ID!
    blog_id: String!
    title: String!
    banner: String!
    des: String!
    publishedAt: Date!
  }

  type NotificationComment {
    _id: ID!
    comment: String!
    isReply: Boolean
    commentedAt: String!
  }

  type Notification {
    type: String!
    blog: NotificationBlog!
    notification_for: Author!
    user: Author!
    comment: NotificationComment
    repley: NotificationComment
    replied_on_comment: NotificationComment
    seen: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }
`;

export { typeDefs };
