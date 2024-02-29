import { AuthenticationError, UserInputError } from "apollo-server-express";
import User, { IUser } from "../../models/user.model";
import { AccessTokenResponse, Context } from "../../types";
import { checkAuth } from "../../middlewares/auth.middleware";
import { uploadCloudinary } from "../../utils/cloudinary";

const generateAccessToken = async (
  userId: string
): Promise<AccessTokenResponse> => {
  const user = await User.findById(userId).select("-password");

  if (user) {
    const accessToken = user.generateAccessToken();
    return { accessToken, loggedUser: user };
  } else {
    throw new AuthenticationError("User not found");
  }
};

const UserQuery = {
  me: (_: any, __: any, { error, user }: Context) => {
    checkAuth(error);

    return user;
  },
};

const UserMutation = {
  loginUser: async (_: any, { userData }: { userData: IUser }) => {
    const { email, password } = userData;

    if (!password || !email) {
      throw new UserInputError("Please fill all field");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError("Invalid crendential");
    }

    const isPassword = await user.isCorrectPassword(password);
    if (!isPassword) {
      throw new AuthenticationError("Invalid crendential");
    }

    const { accessToken, loggedUser } = await generateAccessToken(user?._id);

    return { ...loggedUser.toObject(), token: accessToken };
  },

  signupUser: async (_: any, { userData }: { userData: IUser }) => {
    const { name, email, password, avatar } = userData;

    if (!name || !email || !password || !avatar) {
      throw new AuthenticationError("Please fill all field");
    }

    const extingUser = await User.findOne({ email });
    if (extingUser) {
      throw new AuthenticationError("User is already exist in this email");
    }

    const response = await uploadCloudinary(avatar as string, "users");

    if (!response) {
      throw new AuthenticationError("Cloudinay error ");
    }
    const user = await User.create({
      avatar:{
        url:response.url,
        public_id:response.public_id
      },
      name,
      email,
      password,
    });

    if (!user) {
      throw new AuthenticationError("User creation error");
    }

    const { accessToken, loggedUser } = await generateAccessToken(user?._id);

    return { ...loggedUser.toObject(), token: accessToken };
  },
};

export { UserQuery, UserMutation };
