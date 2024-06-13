const CustomError = require("./../Utils/CustomError");
// production errors vs development errors
const devErrors = (res, err) => {
  res.status(err.statusCode).json({
    status: err.statusCode, // status
    message: err.message, // message
    stackTrace: err.stack,
    error: err,
  });
};

// cast Error
const castErrorHandler = (err) => {
  const msg = `Invalid value  for ${err.path} f${err.value} !`;
  return new CustomError(msg, 400);
};

// duplicateKeyErrorHandler
const duplicateKeyErrorHandler = (err) => {
  const name = err.keyValue.name;
  const msg = `There is a already a movie with a name ${name}. Please user another name!`;
  console.log(name);
  return new CustomError(msg, 400);
};
// validationErrorHandler
const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessage = errors.join(". ");
  const msg = `Invalid input data ${errorMessage}`;
  return new CustomError(msg, 400);
};

const handleExpiredJWT = (err) => {
  return new CustomError("JWT has expired. Please login late", 401);
};

const handleJWTError = (err) => {
  return new CustomError("Invalid Token. Please login again", 401);
};

const prodErrors = (res, err) => {
  // oerational error this operational check is checked from custom error class
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode, // status
      message: err.message, // message
    });
  } else {
    res.status(500).json({
      // non-operationl error
      status: "error",
      message: "Something went wrong plese try again later",
    });
  }
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    // let err = { ...error };
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.name === "TokenExpiredError") error = handleExpiredJWT(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);

    prodErrors(res, error);
  }
};

// SET NODE_ENV=development& nodemon server.js

module.exports = globalErrorHandler;
