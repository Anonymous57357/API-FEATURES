const jwt = require("jsonwebtoken");

const signedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSendResponse = (user, statusCode, res) => {
  const token = signedToken(user._id);
  console.log(token);

  // SENDING JWT AS A COOKIE TO BROWSER

  const options = {
    expiresIn: process.env.JWT_EXPIRE,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res.cookie("jwt", token, options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

module.exports = createSendResponse;
