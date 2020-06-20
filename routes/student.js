const express = require("express");
const CustomError = require("../helper/custom-error");
const {
  validateRegisteredStudent,
  validateLoginRequest,
  validateAccessCode
} = require("../middleware/validateRequest");

const Student = require("../models/student");
const Course = require("../models/course");
const Instructor = require("../models/instructor");


const router = express.Router();

// @route   POST student/signup
// @desc    Register Student
// @access  Public

router.post(
  "/",
  validateRegisteredStudent,
  async (req, res, next) => {
    const course = await Course.findOne({ accessCode: req.body.accessCode }).populate({path: "creator"});
    if (!course) {
      return res.status(400).json({ message: "Access code is wrong" });
    }
    const student = new Student({...req.body});
    await course.updateOne({
      $push: { students: student._id },
    });
    await course.creator.updateOne({
      $push: { teaches: student._id },
    });
    student.courses.push(course);
    student.instructedBy.push(course.creator);
    await student.save();
    return res.status(201).json({ message: "Student Created" });
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
    return res.json({valid: false});
  }
  return res.json({valid: true});
})

module.exports = router;
