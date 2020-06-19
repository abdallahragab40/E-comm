const express = require("express");
const CustomError = require("../helper/custome-error");
const Course = require("../models/course");
const role = require("../middleware/validate-role");
const authenticate = require("../middleware/auth");
const { validateAddCourse } = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  const courses = await Course.find({});
  res.json(courses);
});

router.post(
  "/",
  authenticate,
  validateAddCourse,
  role(["community", "instructor"]),
  async (req, res, next) => {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ message: "Course Created" });
  }
);

module.exports = router;
