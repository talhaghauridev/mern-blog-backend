import { UserLoginType, UserRolesEnum } from "../constants/constants";
import User, { IUser } from "../models/user.model";
import { UserType } from "../types";

class UserService {
  public static async findById(id: string) {
    return User.findById(id);
  }
  public static async findByEmail(email: string) {
    return User.findOne({ "profile_info.email": email });
  }
  public static async createUser(
    user: Pick<UserType, "profile_info" | "loginType" | "refreshToken">
  ) {
    return User.create({
      profile_info: user.profile_info,
      role: UserRolesEnum.USER,
      loginType: user.loginType,
      refreshToken: user.refreshToken,
    });
  }
}

export default UserService;
