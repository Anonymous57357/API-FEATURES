// GET ALL USERS
const {
  getUsers,
  getUser,
  deleteUser,
} = require("../Controllers/userController");

const { protect, restrict } = require("./../controllers/authController");

const express = require("express");

const router = express.Router();

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(getUser)
  .delete(protect, restrict("admin"), deleteUser);

// router.get("/", getUsers);
// router.get("/:id:", getUser);
// router.patch("/:id", patchUserDetails);
// router.patch("/:id", patchUserPassword);
// router.delete("/:id", protect, restrict("admin"), deleteUser);

module.exports = router;
