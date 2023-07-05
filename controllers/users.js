const User = require("../models/userModel");
const { setHashPassword, comparePassword } = require("../utils/password");
const signToken = require("../utils/token");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email in use" });
    }
    const hashPassword = await setHashPassword(password);
    const newUser = await User.create({ email, password: hashPassword });
    res
      .status(201)
      .json({ user: { email, subscription: newUser.subscription } });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Email or password is wrong" });
    const comparedPassword = await comparePassword(password, user.password);
    if (!comparedPassword)
      return res.status(401).json({ message: "Email or password is wrong" });
    const token = signToken(user._id);
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const checkUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkUser,
};
