const { signUp, login } = require("../Controllers/authController");
const express = require("express");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
// router.post("/forgotPassword", forgotPassword);
// router.post("/reset-password", resetPassword);

module.exports = router;
