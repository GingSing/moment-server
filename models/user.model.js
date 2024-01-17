const db = require("../config/database");

module.exports = {
  findOrCreate: (user) => {
    try {
      return db.transaction(() => {
        const findUserStmt = db.prepare(`
          SELECT username, email 
          FROM users
          JOIN oauth_tokens ON oauth_tokens.user_id = users.user_id
          WHERE users.user_id=@userId AND users.email=@email
        `);

        const insertUserStmt = db.prepare(`
            INSERT INTO users (username, email, oauth_provider, oauth_user_id)
            VALUES (@username, @email, @oAuthProvider, @oAuthUserId)
        `);

        const insertOAuthStmt = db.prepare(`
            INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at)
            VALUES (@userId, @accessToken, @refreshToken, @expiresAt)
        `);

        const foundUser = findUserStmt.run(user);

        //TODO make sure this works
        if (foundUser) return foundUser;
        insertUserStmt.run(user);

        return insertOAuthStmt.run({
          userId: newUser.lastInsertRowid,
          ...user,
        });
      });
    } catch (err) {
      console.error("Error occurred creating user:", err);
      throw err;
    }
  },
};
