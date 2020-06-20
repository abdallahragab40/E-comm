const express = require("express");
const CustomError = require("../helper/custom-error");
const Course = require("../models/course");
const Instructor = require("../models/instructor");
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
  role(["instructor"]),
  async (req, res, next) => {
    req.body = { ...req.body, keywords: req.body.keywords.split(","), creator: req.user };
    const course = new Course(req.body);
    await course.save();
    await req.user.updateOne({
      $push: { courses: course._id },
    });
    res.status(201).json({ message: "Course Created", course });
  }
);

module.exports = router;
