const db = require("../config/database");

module.exports = {
  findOrCreate: (user) => {
    try {
      return db.transaction(() => {
        const findUserStmt = db.prepare(`
          SELECT users.user_id, users.username, users.email, oauth_tokens.access_token, oauth_tokens.refresh_token, oauth_tokens.expires_at
          FROM users
          JOIN oauth_tokens ON oauth_tokens.user_id = users.user_id
          WHERE users.oauth_user_id=@oAuthUserId AND users.email=@email
        `);

        const insertUserStmt = db.prepare(`
            INSERT INTO users (username, email, oauth_provider, oauth_user_id)
            VALUES (@username, @email, @oAuthProvider, @oAuthUserId)
            RETURNING user_id, username, email
        `);

        const insertOAuthStmt = db.prepare(`
            INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at)
            VALUES (@userId, @accessToken, @refreshToken, @expiresAt)
            RETURNING access_token, refresh_token, expires_at
        `);
        const foundUser = findUserStmt.get(user);
        if (foundUser) return foundUser;

        const newUser = insertUserStmt.get(user);

        const newUserOAuth = insertOAuthStmt.get({
          userId: newUser.lastInsertRowid,
          ...user,
        });

        return {
          ...newUser,
          ...newUserOAuth,
        };
      })();
    } catch (err) {
      console.error("Error occurred creating user:", err);
      throw err;
    }
  },

  updateAccessToken: (accessTokenData) => {
    try {
      const updateTokenStmt = db.prepare(`
        UPDATE oauth_tokens
        SET access_token=@accessToken
        WHERE user_id=@userId
      `);

      return updateTokenStmt.run(accessTokenData);
    } catch (err) {
      console.error("Error occurred updating access token:", err);
      throw err;
    }
  },
};
