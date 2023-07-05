const Joi = require("joi");

const validateData = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .message({
          "string.email": "must be a valid email, example: 'xxx@xxx.xx'",
        })
        .required(),

      password: Joi.string()
        .min(6)
        .message({
          "string.min": "password must be at least 6 characters long",
        })
        .max(20)
        .message({
          "string.max": "password must be no more than 20 characters",
        })
        .required(),

      subscription: Joi.string(),
    });

    const validation = schema.validate(req.body);

    if (validation.error)
      return res.status(400).json({ message: validation.error.message });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateData;
