const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRATION_TIME,
  });

const decodeToken = (token) => jwt.decode(token);

const getToken = (req) =>
  req.headers.authorization?.startsWith("Beare") &&
  req.headers.authorization.split(" ")[1];

const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email in use" });
    }
    const newUser = await User.create(req.body);
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (User.findOne({ email }))
      return res.status(401).json({ message: "Email or password is wrong" });
    if (User.findOne({ password }))
      return res.status(401).json({ message: "Email or password is wrong" });
    const user = await User.findOne(email, { email: 1, subscription: 1 });
    const token = signToken(user._id);
    res.status(200).json({ token: token }, user);
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { id } = decodeToken(getToken(req));
    const user = await User.findOne({ _id: id }, { token: 0 });
    if (!user) return res.status(401).json({ message: "Not authorized" });
    await User.findOneAndUpdate({ _id: id }, user);
    res.status(204);
  } catch (error) {
    next(error);
  }
};

const checkUser = async (req, res, next) => {
  try {
    const { id } = decodeToken(getToken(req));
    const user = await User.findOne({ _id: id }, { email: 1, subscription: 1 });
    if (!user) return res.status(401).json({ message: "Not authorized" });
    res.status(200).json(user);
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
