const httpStatus = require("http-status");
const {
  getOAuthTokens,
  getOAuthCodeUrl,
  getOAuthProfileData,
} = require("../utils/auth-utils");
const { User } = require("../models");

const redirectOAuthToGoogle = (req, res) => {
  res.redirect(getOAuthCodeUrl());
};

const findOrCreateUser = async (req, res) => {
  const { code } = req.query;
  try {
    const tokenData = await getOAuthTokens({ code });
    const { access_token, refresh_token, expires_in } = tokenData;

    const userInfo = await getOAuthProfileData({
      accessToken: access_token,
    });

    const { sub, name, given_name, picture, email, email_verified, locale } =
      userInfo;

    const user = await User.findOrCreate({
      username: name,
      email: email,
      oAuthProvider: "Google",
      oAuthUserId: sub,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000,
    });

    return res.status(httpStatus.OK).json({
      user,
    });
  } catch (err) {
    console.error("Error occurred during authentication:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error");
  }
};

module.exports = {
  findOrCreateUser,
  redirectOAuthToGoogle,
};
