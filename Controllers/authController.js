const User = require("../Models/userModel");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const util = require("util");
const createSendResponse = require("./../utils/signedToken");
const nodemailer = require("nodemailer");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

// METHOD : POST
// URL: http://localhost:3000/api/v1/movies
const signUp = asyncErrorHandler(async (req, res) => {
  // creating a new user and saved in the server as a jwt and sended the token to the client as a cookie
  const newUser = await User.create(req.body);

  // token
  createSendResponse(newUser, 201, res);
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // checking the email and password are present in the request body

  if (!email || !password) {
    const error = new CustomError(
      "Please provide a valid ID & Password for login in!",
      400
    );
    next(error);
  }

  // Check if user exists with given email
  const user = await User.findOne({ email }).select("+password"); // checking email

  // Check if user exists and password matches

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError("Incorrect Email or Password", 400);
    return next(error);
  }

  // token
  createSendResponse(user, 200, res);
});

// part 1> protecting the routes
const protect = asyncErrorHandler(async (req, res, next) => {
  // protecting the routes
  // 1) Read the token if token is exists
  const testToken = req.headers.authorization;
  // console.log(testToken);

  let token;

  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }

  // console.log(token);

  if (!token) {
    next(new CustomError("You are not logged In!", 404));
  }

  // 2) validate the token

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  // console.log(decodedToken);

  // 3) if the user exits
  const user = await User.findById(decodedToken.id);
  // console.log(user);

  if (!user) {
    const error = new CustomError("The user with given token does not exist");
    next(error);
  }
  // 4) if the user changed password after the token is issue

  const isPasswordChangedAt = await user.isPasswordChanged(decodedToken.iat);
  // decoded token iat (payload)
  if (isPasswordChangedAt) {
    const error = new CustomError(
      "User has changed password recently. Please log in again",
      401
    );
    next(error);
  }

  // 5) Allow user to access the route
  req.user = user;
  next();
});

// authorization
const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        "Access Denied. You do not have the permission to acccess the route",
        403
      );
      next(error);
    }
    next();
  };
};

// authorization
// const restrict = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       const error = new CustomError(
//         "Access Denied. You do not have the permission to acccess the route",
//         403
//       );
//       next(error);
//     }
//     next();
//   };
// };

// const restrict = (...role) => {
//   // authorization
//   return (req, res, next) => {
//     if (!role.includes(req.user.role)) {
//       const error = new CustomError(
//         `User do not have the permission or authorization to access the route! Only ${role} can access the route`,
//         403
//       );
//       next(error);
//     }
//     next();
//   };
// };

// const forgotPassword = asyncErrorHandler(async (req, res, next) => {
//   // 1) GET THE USER BASED ON USER EMAIL
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     const error = new CustomError(
//       "we could not find the user with the given email",
//       404
//     );
//     next(error);
//   }

//   // 2) GENERATE A RANDOM GENERATE TOKEN
//   // create a instance method
//   const resetToken = await user.createResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) SEND THE TOKEN BACK TO THE EMAIL
//   const resetUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/users/resetPassword/${resetToken}`;
//   const message = `we have received reset password request. Please use the below link to reset the password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Password change request received",
//       message: message,
//     });
//     res.status(200).json({
//       status: "success",
//       message: "password reset link sent to the user email",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetTokenExpires = undefined;
//     user.save({ validateBeforeSave: false });

//     return next(
//       new CustomError(
//         `There was a error sending passwoord resert email. Please try again later`,
//         500
//       )
//     );
//   }
// });

// const resetPassword = asyncErrorHandler(async (req, res, next) => {
//   // 1. IF TEH USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
//   const token = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");
//   const user = await User.findOne({
//     passwordResetToken: token,
//     passwordResetTokenExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     const error = new CustomError(`Invalid token or token has expired`, 400);
//     return next(error);
//   }

//   // 2. RESETTING THE USER PASSWORD
//   user.password = req.body.password;
//   user.confirmPassword = req.body.confirmPassword;
//   user.passwordResetToken = undefined;
//   user.passwordResetTokenExpires = undefined;
//   user.passwordChangedAt = Date.now();

//   user.save();

//   // 3.LOGIN THE USER
//   const loginToken = signedToken(user._id);
//   console.log(token);

//   res.status(200).json({
//     status: "success",
//     token: loginToken,
//   });
// });

// RESET PASSWORD FUNTIONILITY
// const resetPassword = asyncErrorHandler(async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email }).select("-confirmPassword");

//   // checking email if present in the userdocument
//   if (!user) {
//     const error = new CustomError(`some error on the email field`, 404);
//     return next(error);
//   }

//   const token = Math.random().toString(36).slice(-8);
//   console.log(token);

//   user.passwordResetToken = token;
//   user.passwordResetTokenExpires = Date.now() + 3600000; // 1 hour

//   await user.save(); // saving the user

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "mukesh.vijayakumar20@gmail.com",
//       pass: "nodemailer",
//     },
//   });

//   const message = {
//     from: "mukesh.vijayakumar20@gmail.com",
//     to: user.email,
//     subject: "Password reset request",
//     text: `You are reveiving the email because you (or someone else) has request to reset the password for this account. \n\n Please use the following token ${token}. If you did not request the password please ignore the email.`,
//   };

//   transporter.sendMail(message, (err, info) => {
//     if (err) {
//       res.status(404).json({
//         message: `Something went wrong. Please try again later! ${err.message}`,
//       });
//     } else {
//       res.status(200).json({
//         message: `Email sended successfully ${info.response}`,
//       });
//     }
//   });
// });

module.exports = {
  signUp,
  login,
  protect,
  restrict,
};
