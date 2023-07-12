const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkUser,
  changeAvatar,
} = require("../../controllers/users");
const validateData = require("../../middlewares/users");
const uploadUserAvatar = require("../../middlewares/avatar");
const auth = require("../../middlewares/authorization");

const router = express.Router();

router.route("/register").post(validateData, registerUser);

router.route("/login").post(validateData, loginUser);

router.route("/logout").post(auth, logoutUser);

router.route("/current").get(auth, checkUser);

router.route("/avatars").patch(auth, uploadUserAvatar, changeAvatar);

module.exports = router;
