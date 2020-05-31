const { validationResult } = require("express-validator");
const createError = require("http-errors");

module.exports = (validatorsArray) => async (req, res, next) => {
  const promises = validatorsArray.map((validator) => validator.run(req));
  await Promise.all(promises);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createError(
      errors.errors.map((err) => err.msg).join(`, `),
      422
    );
    return next(error);
  }
  next();
};
