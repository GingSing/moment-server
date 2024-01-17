const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const routes = require("./routes/v1");
const ApiError = require("./utils/ApiError");
const path = require("path");

const app = express();

// set security HTTP headers
app.use(helmet());

//parse json request body
app.use(
  express.json({
    limit: "10mb",
  })
);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

const corsOptions = {
  origin: true,
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  allowedHeaders: "Content-Type",
  credentials: true,
};

// enable cors
app.use(cors(corsOptions));
app.options("*", cors());

// v1 api routes
app.use("/v1", routes);

app.use(express.static(path.join(__dirname, "public")));

// send 404 response to unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not Found"));
});

module.exports = app;
