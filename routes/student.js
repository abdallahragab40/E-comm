const express = require("express");
const CustomError = require("../helper/custome-error");
const {
  validateRegisteredStudent,
  validateLoginRequist,
} = require("../middleware/validateRequest");

const Student = require("../models/student");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// @route   POST student/signup
// @desc    Register Student
// @access  Public

router.post(
  "/",
  validateRegisteredStudent,
  // fileUpload.single("image"),
  async (req, res, next) => {
    // const url = req.protocol + "://" + req.get("host");
    const student = new Student({
      ...req.body,
      // imagePath: url + "/public/images/" + req.file.filename,
    });
    await student.save();
    res.status(201).json({ message: "Student Created" });
  }
);

// @route   POST student/login
// @desc    Register Student
// @access  Public

router.post("/login", validateLoginRequist, async (req, res, next) => {
  let student = await Student.findOne({ email: req.body.email });

  if (!student) {
    throw new CustomError("Email not exists", 401);
  }

  const matchPassword = await student.checkPassword(req.body.password);
  if (!matchPassword) {
    throw new CustomError("Incorrect Password", 401);
  }

  const token = await student.generateToken();
  res.json({
    message: "Logged in successfully",
    student,
    token,
  });
});
module.exports = router;
