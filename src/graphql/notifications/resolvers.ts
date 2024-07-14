import { ErrorTypes } from "@/constants/ErrorTypes";
import Notification, { INotification } from "@/models/notification.model";
import ApolloError from "@/utils/ApolloError";
import { Context, verifyUser } from "@/utils/context";
import { NotificationsInput } from "./interfaces";
import { FilterQuery } from "mongoose";
import { Info } from "@/types";
import { extractFields, findInfoField } from "@/utils/utils";

const queries = {
  newNotifications: async (_: any, __: any, ctx: Context) => {
    const user = await verifyUser(ctx);

    try {
      const isNotifications = await Notification.exists({
        notification_for: user._id,
        user: { $ne: user._id },
        seen: false,
      });

      if (!isNotifications) {
        return false;
      }
      return true;
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
  notifications: async (
    _: any,
    { input }: NotificationsInput,
    ctx: Context,
    info: Info
  ) => {
    const user = await verifyUser(ctx);
    const fields = extractFields(info);
    const { page, limit = 10, filter, deletedDocCount } = input;
    console.log(fields);

    let skip = (page - 1) * limit;
    const findQuery: FilterQuery<INotification> = {
      notification_for: user._id,
      user: { $ne: user._id },
    };

    if (filter !== "all") {
      findQuery.type = filter;
    }
    if (deletedDocCount) {
      skip -= deletedDocCount;
    }

    try {
      const notificationQuery = Notification.find(findQuery);

      if (findInfoField(fields, "notifications.blog")) {
        notificationQuery.populate(
          "blog",
          "_id blog_id title banner des publishedAt "
        );
      } else if (findInfoField(fields, "notifications.user")) {
        notificationQuery.populate(
          "user",
          "profile_info.profileImage profile_info.username profile_info.email profile_info.fullName joinedAt social_links account_info"
        );
      } else if (findInfoField(fields, "notifications.reply")) {
        notificationQuery.populate("reply", "_id comment isReply commentedAt");
      } else if (findInfoField(fields, "notifications.comment")) {
        notificationQuery.populate(
          "comment",
          "_id comment isReply commentedAt"
        );
      } else if (findInfoField(fields, "notifications.replied_on_comment")) {
        notificationQuery.populate(
          "replied_on_comment",
          "_id comment isReply commentedAt"
        );
      }

      const notifications = await notificationQuery
        .skip(skip)
        .limit(limit)
        .exec();

      if (fields.includes("count")) {
        const count = await Notification.countDocuments(findQuery);
        return { notifications, count };
      }
      await Notification.updateMany(findQuery, { seen: true })
        .skip(skip)
        .limit(limit);
      return notifications;
    } catch (error: any) {
      return ApolloError(error.message, ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  },
};

const mutations = {};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
