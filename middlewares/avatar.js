const {upload} = require("../services/imageService");

const uploadUserAvatar = upload("avatar");

module.exports = uploadUserAvatar;
