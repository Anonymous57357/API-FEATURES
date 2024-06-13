const colors = require("colors");

const express = require("express");

// 127.0.0.1:6379>

const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit"); // security
const helmet = require("helmet"); // security
const sanitize = require("express-mongo-sanitize"); // prevent nosql injection
const xss = require("xss-clean"); // prevent any html or javscript-injection

// CustomError
const CustomError = require("././utils/CustomError"); // importing cutom error

// globalErroHandler
const globalErrorHandler = require("././middlewares/globalErrorHandler"); // importing globalerrrohandler

// helmet
app.use(helmet());

// rate-limit
let limiter = rateLimit({
  max: 1000, // maximum request
  windowMs: 60 * 60 * 1000, // 60 minutes
  message: "Too many requests from this IP, please try again after an hour", // message
});

app.use("/api", limiter);

// middlewares

app.use(express.json({ limit: "10kb" }));

app.use(sanitize()); // security // prevent nosql injection
app.use(xss());

app.use(morgan("dev"));

// connect to Redis

//----
// routes
//----
// movie routes
const movieRoute = require("././Routes/movieRoute");

// auth routes
const authRoute = require("././Routes/authRoute");

// user routes
const userRoute = require("././Routes/userRoute");

// mounting routes
app.use("/api/v1/movies", movieRoute);
app.use("/api/v1/users", authRoute);
app.use("/api/v1/users", userRoute);

// Error Handlers middlewares

// 404 error
app.use("*", (req, res, next) => {
  // level 1
  // console.log(req.originalUrl);
  // res.status(404).json({
  //   status: "fail",
  //   message: `${req.originalUrl} - Route is not found!`,
  // });
  // level 2
  // const err = new Error(`${req.originalUrl} - Route is not found!`);
  // err.status = "fail";
  // err.statusCode = 404;
  // intead of this we can create new custom error and put it in the new erro not found handler
  const err = new CustomError(`${req.originalUrl} - Route is not found!`, 404);
  next(err);
});

// global errorHandlerMiddleware
app.use(globalErrorHandler);

// listen to the server

module.exports = app;
