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

router.get("/instructor", authenticate, async (req, res, next) => {
  const courses = await Course.find({ creator: req.user._id });
  res.json(courses);
});
router.get("/:id", authenticate, async (req, res, next) => {
  const courses = await Course.findById(req.params.id);
  res.json(courses);
});

router.post(
  "/",
  authenticate,
  validateAddCourse,
  role(["instructor"]),
  async (req, res, next) => {
    const instructor = await Instructor.findById(req.body.creator);
    if (!instructor) {
      throw new CustomError("Authorization faild", 401);
    }
    req.body = { ...req.body, keywords: req.body.keywords.split(",") };
    const course = new Course(req.body);
    course.instructor = req.user;
    await course.save();
    await instructor.updateOne({
      $push: { courses: course._id },
    });
    res.status(201).json({ message: "Course Created", course });
  }
);

module.exports = router;
