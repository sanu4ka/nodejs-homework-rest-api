const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkUser,
} = require("../../controllers/users");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/current").get(checkUser);

module.exports = router;
