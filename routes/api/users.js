const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkUser,
  changeAvatar,
  verifyToken,
  resendEmail,
} = require("../../controllers/users");
const { validateUserData, validateEmail } = require("../../middlewares/users");
const uploadUserAvatar = require("../../middlewares/avatar");
const auth = require("../../middlewares/authorization");

const router = express.Router();

router.route("/register").post(validateUserData, registerUser);

router.route("/login").post(validateUserData, loginUser);

router.route("/logout").post(auth, logoutUser);

router.route("/current").get(auth, checkUser);

router.route("/avatars").patch(auth, uploadUserAvatar, changeAvatar);

router.route("/verify/:verificationToken").get(verifyToken);

router.route("/verify").post(validateEmail, resendEmail);

module.exports = router;
