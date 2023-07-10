const multer = require("multer");
const jimp = require("jimp");
const path = require("path");
 
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
     
  }

  const process = async function (file, dir, name) {
    await jimp
      .read(file)
      .then((img) => {
        return img.resize(250, 250).quality(60).write(`${dir}/${name}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };


module.exports = { upload, process };
