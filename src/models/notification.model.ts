import { AvailableUserNotifications } from "@/constants/constants";
import { Document, Model, Schema, model, models } from "mongoose";

export type NotificationType = "like" | "comment" | "reply";

export interface INotification extends Document {
  type: NotificationType;
  blog: Schema.Types.ObjectId;
  notification_for: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
  reply?: Schema.Types.ObjectId;
  replied_on_comment?: Schema.Types.ObjectId;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: AvailableUserNotifications,
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    notification_for: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    reply: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    replied_on_comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> =
  models?.Notification ||
  model<INotification>("Notification", notificationSchema);
export default Notification;
