const express = require("express");
const Instructor = require("../models/instructor");
const fileUpload = require("../middleware/file-upload");
const CustomError = require("../helper/custome-error");
const { validateLoginRequist } = require("../middleware/validateRequest");

const router = express.Router();

// @route   POST instructor/signup
// @desc    Register Instructor
// @access  Public

router.post("/signup", fileUpload.single("image"), async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const instructor = new Instructor({
    ...req.body,
    imagePath: url + "/public/images/" + req.file.filename,
  });
  await instructor.save();
  res.status(201).json({ message: "Instructor Created" });
});

// @route   POST instructor/login
// @desc    Register Instructor
// @access  Public

router.post("/login", validateLoginRequist, async (req, res, next) => {
  let instructor = await Instructor.findOne({ email: req.body.email });

  if (!instructor) {
    throw new CustomError("Email not exists", 401);
  }

  const matchPassword = await instructor.checkPassword(req.body.password);
  if (!matchPassword) {
    throw new CustomError("Incorrect Password", 401);
  }

  const token = await instructor.generateToken();
  res.json({
    message: "Logged in successfully",
    instructor,
    token,
  });
});
module.exports = router;
