const httpStatus = require("http-status");
const {
  getOAuthTokens,
  getOAuthCodeUrl,
  getOAuthProfileData,
  refreshOAuthToken,
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

    const {
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken,
      ...rest
    } = user;

    // Set tokens for authentication
    req.session.user = user;
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;

    return res.status(httpStatus.OK).json({
      user: { ...rest },
    });
  } catch (err) {
    console.error("Error occurred during authentication:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error");
  }
};

const refreshToken = async (req, res) => {
  try {
    const { data } = await refreshOAuthToken({
      refreshToken: req.session.refreshToken,
    });

    req.session.accessToken = data.access_token;
    await User.updateAccessToken({
      user: req.session.user,
      accessToken: data.access_token,
    });
    return res.status(httpStatus.OK).send("Update was successful");
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error");
  }
};

module.exports = {
  findOrCreateUser,
  redirectOAuthToGoogle,
  refreshToken,
};
