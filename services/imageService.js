const multer = require("multer");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;

const tempDir = path.join(__dirname, "..", "tmp");

const upload = function (name) {
  const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  return multer({
    storage: multerConfig,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  }).single(name);
};

const process = async function (file, name) {
  await jimp
    .read(`${tempDir}/${file.filename}`)
    .then((img) => {
      return img
        .resize(250, 250)
        .quality(60)
        .write(`${tempDir}/${file.filename}`);
    })
    .catch((err) => {
      console.error(err);
    });
  await fs.rename(`${tempDir}/${file.filename}`, `./public/avatars/${name}`);
};

module.exports = { upload, process };
