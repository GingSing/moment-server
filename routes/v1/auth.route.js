const express = require("express");
const { authController } = require("../../controllers");
const { isAuthenticated } = require("../../utils/middleware");
const router = express.Router();

router.route("/google").get(authController.redirectOAuthToGoogle);

router.route("/google/callback").get(authController.findOrCreateUser);

router
  .route("/refresh-token")
  .get(isAuthenticated, authController.refreshToken);

module.exports = router;
