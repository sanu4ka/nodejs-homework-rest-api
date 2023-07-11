const User = require("../models/userModel");
const { process } = require("../services/imageService");
const { setHashPassword, comparePassword } = require("../services/password");
const signToken = require("../services/token");
const sendMail = require("../services/sendEmail");
const gravatar = require("gravatar");
const uuid = require("uuid");

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
    const verificationToken = uuid.v4();
    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    await sendMail(email, verificationToken);
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
    if (!user.verify) {
      return res
        .status(401)
        .json({ message: "Verification failed, please verify your account" });
    }
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
  const newFileName = `${uuid.v4()}.jpeg`;
  const newAvatar = `/avatars/${newFileName}`;
  await process(file, newFileName);
  await User.findByIdAndUpdate(user._id, { avatarURL: newAvatar });
  res.status(200).json({ newAvatar });
};

const verifyToken = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken: verificationToken });
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    // if (!email)
    //   return res.status(404).json({ message: "missing required field email" });
    const user = await User.findOne({ email });

    if (!user || user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const verificationToken = uuid.v4();
    User.findByIdAndUpdate(user._id, {
      verificationToken: verificationToken,
    });
    await sendMail(email, verificationToken);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkUser,
  changeAvatar,
  verifyToken,
  resendEmail,
};
