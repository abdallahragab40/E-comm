const express = require("express");
const CustomError = require("../helper/custom-error");
const {
  validateRegisteredStudent,
  validateLoginRequest,
  validateAccessCode
} = require("../middleware/validateRequest");

const Student = require("../models/student");

const router = express.Router();

// @route   POST student/signup
// @desc    Register Student
// @access  Public

router.post(
  "/",
  validateRegisteredStudent,
  async (req, res, next) => {
    const course = await Course.findOne({ accessCode: req.body.accessCode }).populate({path: "instructors"})
    const student = new Student({...req.body});
    student.courses.push(course);
    student.instructedBy = student.instructedBy.concat(course.instructors);
    await student.save();
    res.status(201).json({ message: "Student Created" }, student);
  }
);

// @route   POST student/login
// @desc    Register Student
// @access  Public

router.post("/login", validateLoginRequest, async (req, res, next) => {
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

router.post("/access-code", validateAccessCode, async (req, res, next) => {
  const course = await Course.findOne({ accessCode: req.body.accessCode });
  if(!course) {
    res.json({valid: false});
  }
  res.json({valid: true});
})

module.exports = router;
