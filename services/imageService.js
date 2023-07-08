const multer = require("multer");
const jimp = require("jimp");

class ImageService {
  static upload(name) {
    const multerStorage = multer.memoryStorage();

    return multer({
      storage: multerStorage,
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }).single(name);
  }

  static async save(file, path) {
    await jimp
      .read(file.buffer)
      .then((img) => {
        return img
          .resize(250, 250)
          .quality(60)
          .write(`${path}/${file.originalname}`);
      })
      .catch((err) => {
        console.error(err);
      });
    return file.originalname;
  }
}

module.exports = ImageService;
