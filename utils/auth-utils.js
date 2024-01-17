const fetch = require("node-fetch");

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.REDIRECT_URI}/auth/google/callback`, // Update with your callback URL
};

const getOAuthCodeUrl = () => {
  const scopes = ["profile", "email", "openid"];

  return `https://accounts.google.com/o/oauth2/auth?client_id=${
    googleConfig.clientId
  }&redirect_uri=${
    googleConfig.redirectUri
  }&response_type=code&scope=${scopes.join(" ")}&access_type=offline`;
};

const getOAuthTokens = async ({ code }) => {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: JSON.stringify({
      code,
      client_id: googleConfig.clientId,
      client_secret: googleConfig.clientSecret,
      redirect_uri: googleConfig.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  // Token data
  return await tokenResponse.json();
};

const getOAuthProfileData = async ({ accessToken }) => {
  const profileDataResponse = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return await profileDataResponse.json();
};

const refreshOAuthToken = async ({ refreshToken }) => {
  const newAccessTokenResponse = await fetch(
    `https://oauth.provider.com/token`,
    {
      grant_type: "refresh_token",
      client_id: googleConfig.clientId,
      client_secret: googleConfig.clientSecret,
      refreshToken: refreshToken,
    }
  );

  return newAccessTokenResponse.json();
};

module.exports = {
  getOAuthCodeUrl,
  getOAuthTokens,
  getOAuthProfileData,
  refreshOAuthToken,
};
