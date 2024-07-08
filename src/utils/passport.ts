import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserLoginType } from "../constants/constants";
import UserService from "../services/user.services";
import ApiError from "./ApiError";

dotenv.config();
console.log({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_, __, profile, next) => {
      try {
        console.log(profile._json);
        const user = await UserService.findByEmail(profile._json.email!);
        console.log(user);

        if (user) {
          if (user.loginType !== UserLoginType.GOOGLE) {
            next(
              new ApiError(
                400,
                "You have previously registered using " +
                  user.loginType?.toLowerCase()?.split("_").join(" ") +
                  ". Please use the " +
                  user.loginType?.toLowerCase()?.split("_").join(" ") +
                  " login option to access your account."
              ),
              null!
            );
          } else {
            next(null, user);
          }
        } else {
          // If user with email does not exists, means the user is coming for the first time
          const createdUser = await UserService.createUser({
            profile_info: {
              fullName: profile._json.name!,
              email: profile._json.email!,
              password: profile._json.sub,
              username: profile._json.email?.split("@")[0]!,
              profileImage: {
                url: profile._json.picture!,
                public_url: "",
              },
            },
            loginType: UserLoginType.GOOGLE,
          });

          if (createdUser) {
            next(null, createdUser);
          } else {
            next(new ApiError(500, "Error while registering the user"), null!);
          }
        }
      } catch (error) {
        console.error("Error in Google OAuth Strategy:", error);
        return next(error, false);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user!);
});
