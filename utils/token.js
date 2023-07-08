const jwt = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRATION_TIME,
  });

module.exports = signToken;
