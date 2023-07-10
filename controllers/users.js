const User = require("../models/userModel");
const ImageService = require("../services/imageService");
const { setHashPassword, comparePassword } = require("../services/password");
const signToken = require("../services/token");
const gravatar = require("gravatar");
const fs = require("fs").promises;
const uuid = require("uuid");
const path = require("path");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email in use" });
    }
    const avatarURL = gravatar.url(
      email,
      { s: "250", r: "x", d: "retro" },
      false
    );
    const hashPassword = await setHashPassword(password);
    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
    });
    console.log(avatarURL, email);
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

    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const changeAvatar = async (req, res, next) => {
  const { user, file } = req;
  await fs.mkdir('../tmp',  { recursive: true })
  const tempDir = path.join(__dirname, "../", "tmp");
  await ImageService.save(file);
  const oldAvatar = `${tempDir}/${file.originalname}`;
  const newDir = path.join(__dirname, "../", "public/avatars");
  const newFileName = `${uuid.v4()}.jpeg`;
  const avatarURL = `${newDir}/${newFileName}`;
  await fs.rename(oldAvatar, avatarURL);
  await User.findByIdAndUpdate(user._id, { avatarURL: avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkUser,
  changeAvatar,
};
