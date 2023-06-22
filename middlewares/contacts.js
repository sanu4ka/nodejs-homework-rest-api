const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const checkId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isCorrectId = isValidObjectId(id);

    if (isCorrectId) return next();

    const error = new Error("Not found");
    error.status = 404;

    next(error);
  } catch (error) {
    next(error);
  }
};

const checkData = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: `missing fields` });
    }

    const { name, email, phone } = req.body;
    let fieldName = "name";

    if (!email) fieldName = "email";
    else if (!phone) fieldName = "phone";

    if (!name || !email || !phone)
      return res
        .status(400)
        .json({ message: `missing required ${fieldName} field` });

    next();
  } catch (error) {
    next(error);
  }
};

const checkFavoriteData = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: `missing field favorite` });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const validateData = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string()
        .min(3)
        .message({
          "string.min": "minimum 3 character required",
        })
        .max(30)
        .message({
          "string.max": "maximum 30 characters allowed",
        })
        .required(),

      email: Joi.string()
        .email()
        .message({
          "string.email": "must be a valid email, example: 'xxx@xxx.xx'",
        })
        .required(),

      phone: Joi.string()
        .pattern(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/)
        .message("the phone field must have this format '(xxx) xxx-xxxx'")
        .required(),
    });

    const validation = schema.validate(req.body);

    if (validation.error)
      return res.status(400).json({ message: validation.error.message });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkFavoriteData,
  checkId,
  checkData,
  validateData,
};
