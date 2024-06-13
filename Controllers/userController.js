const User = require("../Models/userModel");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// METHOD : GET
// URL: http://localhost:3000/api/v1/users
const getUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    count: users.length,
    data: {
      users,
    },
  });
});

// METHOD : GET
// URL: http://localhost:3000/api/v1/users/:id
const getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new CustomError(
      ` user with the given id ${req.params.id} is not found`,
      404
    );
    next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// METHOD : GET
// URL: http://localhost:3000/api/v1/users/:id
// const patchUserDetails = asyncErrorHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!user) {
//     const error = new CustomError(
//       ` user with the given id ${req.params.id} is not found`,
//       404
//     );
//     next(error);
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });

// METHOD : GET
// URL: http://localhost:3000/api/v1/users/:id
// const patchUserPassword = asyncErrorHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!user) {
//     const error = new CustomError(
//       ` user with the given id ${req.params.id} is not found`,
//       404
//     );
//     next(error);
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });

// METHOD : GET
// URL: http://localhost:3000/api/v1/users/:id
const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    const error = new CustomError(
      ` user with the given id ${req.params.id} is not found`,
      404
    );
    next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports = {
  getUsers,
  getUser,
  deleteUser,
};
