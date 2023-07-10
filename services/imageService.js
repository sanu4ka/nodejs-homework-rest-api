const multer = require("multer");
const jimp = require("jimp");
const path = require("path");

class ImageService {

   static upload(name) {
    const multerStorage = multer.memoryStorage();
     const tempDir = path.join(__dirname, "../", "tmp");
    return multer({
      storage: multerStorage,
      dest: tempDir,
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }).single(name);
  }

  static async save(file) {
    const tempDir = path.join(__dirname, "../", "tmp");
    await jimp
      .read(file.buffer)
      .then((img) => {
        return img
          .resize(250, 250)
          .quality(60)
          .write(`${tempDir}/${file.originalname}`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = ImageService;
