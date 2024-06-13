class CustomError extends Error {
  // the customerror class is inherited to the error contstructor
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    this.isOperational = true;
    // instead of creating a new errstack // preserve the errstack from the Error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;

// reference
// const err = new Error(`some errormessage(messate)`, 404("statusCode"))
