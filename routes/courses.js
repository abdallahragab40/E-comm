const express = require("express");
const CustomError = require("../helper/custom-error");
const Course = require("../models/course");
const Instructor = require("../models/instructor");
const role = require("../middleware/validate-role");
const authenticate = require("../middleware/auth");
const { validateAddCourse } = require("../middleware/validateRequest");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  res.json(req.user.courses);
});

router.get("/instructor", authenticate, async (req, res, next) => {
  const courses = await Course.find({ creator: req.user._id });
  res.json(courses);
});


router.get("/categories", async (req, res, next) => {
  const categories =  [
    {
      id: 0,
      value: 'Computer Science',
      label: 'Computer Science',
    },
    {
      id: 1,
      value: 'Software Engineering',
      label: 'Software Engineering',
    },
    {
      id: 2,
      value: 'Business',
      label: 'Business',
    },
    {
      id: 3,
      value: 'Accounting',
      label: 'Accounting',
    },
  ];
  res.json({ categories });
});

router.post(
  "/",
  authenticate,
  validateAddCourse,
  role(["instructor"]),
  async (req, res, next) => {
    req.body = {
      ...req.body,
      keywords: req.body.keywords.split(","),
      creator: req.user,
    };
    const course = new Course(req.body);
    course.accessCode = uuidv4();
    await course.save();
    await req.user.updateOne({
      $push: { courses: course._id },
    });
    res.status(201).json({ message: "Course Created", course });
  }
);

router.get("/:id", authenticate, async (req, res, next) => {
  const courses = await Course.findById(req.params.id);
  res.json(courses);
});


module.exports = router;
