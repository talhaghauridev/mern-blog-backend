export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const UserNotificationEnum = {
  LIKE: "like",
  COMMENT: "comment",
  REPLY: "reply",
};

export const AvailableUserNotifications = Object.values(UserNotificationEnum);

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const UserLoginType = {
  GOOGLE: "GOOGLE",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

export const AvailableSocialLogins = Object.values(UserLoginType);
