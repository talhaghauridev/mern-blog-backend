import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  FRONTEND_URI,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../constants/env";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URI}/login`,
    session: false,
  }),
  async (req: any, res) => {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URI}/login`);
    }
    const user = req.user;

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    };

    return res
      .status(301)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect(
        `${FRONTEND_URI}?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
  }
);

router.get("/logout", (req: any, res) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
});

router.get("/success", (req, res) => {});

export default router;
