const express = require("express");
const Instructor = require("../models/instructor");
const CustomError = require("../helper/Custom-error");
const { validateLoginRequest } = require("../middleware/validateRequest");
const authenticate = require("../middleware/auth");

const router = express.Router();

// @route   POST instructor/signup
// @desc    Register Instructor
// @access  Public

router.post("/signup", async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const instructor = new Instructor({ ...req.body });
  await instructor.save();
  res.status(201).json({ message: "Instructor Created" });
});

// @route   POST instructor/login
// @desc    Register Instructor
// @access  Public

router.post("/login", validateLoginRequest, async (req, res, next) => {
  let instructor = await Instructor.findOne({
    email: req.body.email,
  }).populate("teaches", { username: 1 });

  if (!instructor) {
    throw new CustomError("Invalid credentials", 401);
  }

  const matchPassword = await instructor.checkPassword(req.body.password);
  if (!matchPassword) {
    throw new CustomError("Invalid credentials", 401);
  }

  const token = await instructor.generateToken();
  res.json({
    message: "Logged in successfully",
    user: instructor,
    token,
    expiresIn: 3600,
  });
});

router.post("/plan", authenticate, async (req, res, next) => {
  const instructor = req.user;
  instructor.plan = req.body.plan;
  await instructor.save();
  res.status(201).json({
    message: `You have Successfully upgraded your account to ${instructor.plan} plan`,
    plan: instructor.plan,
  });
});

router.get("/plan", authenticate, async (req, res, next) => {
  res.json({ plan: req.user.plan });
});

module.exports = router;
