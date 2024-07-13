import { NotificationType } from "@/models/notification.model";

type NotificationsInput = {
  input: {
    page: number;
    filter: NotificationType | "all";
    deletedDocCount: number;
    limit?: number;
  };
};

export { NotificationsInput };
