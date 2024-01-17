const express = require("express");
const { authController } = require("../../controllers");
const router = express.Router();

router.route("/google").get(authController.redirectOAuthToGoogle);

router.route("/google/callback").get(authController.findOrCreateUser);

module.exports = router;
