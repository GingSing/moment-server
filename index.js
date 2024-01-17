require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
let server;

server = app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}.`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error("Unexpected Error has occurred.", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// when process is killed
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
