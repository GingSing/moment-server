const httpStatus = require("http-status");

const isAuthenticated = (req, res, next) => {
  if (req.session.accessToken) {
    next();
  } else {
    res.status(httpStatus.UNAUTHORIZED).send("UNAUTHORIZED ACCESS");
  }
};

// update when role permissions are added
const isAuthorized = (req, res, next) => {};

module.exports = { isAuthenticated, isAuthorized };
