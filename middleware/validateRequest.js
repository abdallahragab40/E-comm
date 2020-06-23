const { check, validationResult } = require("express-validator");
const CustomError = require("../helper/custom-error");

const validateLoginRequest = [
  check("email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validateRegisteredStudent = [
  check("username").notEmpty().withMessage("username is required"),
  check("email").notEmpty().withMessage("email is required"),
  check("phone").notEmpty().withMessage("phone is required"),
  check("password").notEmpty().withMessage("password is required"),
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
  check("description").notEmpty().withMessage("description is required"),
  check("duration").notEmpty().withMessage("duration is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Invalid request params", 422, errors.mapped());
    }
    next();
  },
];

const validateAccessCode = [
  check("accessCode").notEmpty().withMessage("Access code is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Access code is required", 422, errors.mapped());
    }
    next();
  },
];

module.exports = {
  validateRegisteredStudent,
  validateLoginRequest,
  validateAccessCode,
  validateAddCourse,
};
