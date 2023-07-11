const bcrypt = require("bcryptjs");

const setHashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
const comparePassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

module.exports = {
  setHashPassword,
  comparePassword,
};
