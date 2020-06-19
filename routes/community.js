const express = require("express");
const CustomError = require("../helper/Custom-error");

const Community = require("../models/community");
const fileUpload = require("../middleware/file-upload");
const { validateLoginRequest } = require("../middleware/validateRequest");

const router = express.Router();

// @route   POST community/signup
// @desc    Register Community
// @access  Public

router.post("/signup", fileUpload.single("image"), async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const community = new Community({
    ...req.body,
    imagePath: url + "/public/images/" + req.file.filename,
  });
  await community.save();
  res.status(201).json({ message: "Community Created" });
});

// @route   POST community/login
// @desc    Register Community
// @access  Public

router.post("/login", validateLoginRequest, async (req, res, next) => {
  let community = await Community.findOne({ email: req.body.email });

  if (!community) {
    throw new CustomError("Email not exists", 401);
  }

  const matchPassword = await community.checkPassword(req.body.password);
  if (!matchPassword) {
    throw new CustomError("Incorrect Password", 401);
  }

  const token = await community.generateToken();

  res.json({
    message: "Logged in successfully",
    community,
    token,
  });
});
module.exports = router;
