const express = require("express");
const Instructor = require("../models/instructor");
const CustomError = require("../helper/custome-error");
const { validateLoginRequist } = require("../middleware/validateRequest");

const router = express.Router();

// @route   POST instructor/signup
// @desc    Register Instructor
// @access  Public

router.post("/signup", async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const instructor = new Instructor({...req.body});
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
    user: instructor,
    token,
    expiresIn: 3600
  });
});
module.exports = router;
