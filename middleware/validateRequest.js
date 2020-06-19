const { check, validationResult } = require("express-validator");
const CustomError = require("../helper/custome-error");

const validateLoginRequist = [
  check("email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("pasword is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validateRegisteredStudent = [
  check("firstName").notEmpty().withMessage("first name is required"),
  check("lastName").notEmpty().withMessage("last name is required"),
  check("email").notEmpty().withMessage("email is required"),
  check("phoneNumber").notEmpty().withMessage("phoneNumber is required"),
  check("password").notEmpty().withMessage("pasword is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validateAddCourse = [
  check("title").notEmpty().withMessage("title is required"),
  check("describtion").notEmpty().withMessage("describtion is required"),
  check("community").notEmpty().withMessage("community is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

module.exports = {
  validateRegisteredStudent,
  validateLoginRequist,
  validateAddCourse,
};
