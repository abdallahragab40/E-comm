const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Instructor = require("../models/instructor");
const Community = require("../models/community");
const CustomError = require("../helper/Custom-error");
const auth = require("../middleware/auth");
const fileUpload = require("../middleware/file-upload");
const cloudinary = require("cloudinary").v2;

router.post("/login", async (req, res, next) => {
  let student = await Student.findOne({ email: req.body.email });
  if (student) {
    return res.redirect(307, "/student/login");
  }
  let instructor = await Instructor.findOne({ email: req.body.email });
  if (instructor) {
    return res.redirect(307, "/instructor/login");
  }
  let community = await Community.findOne({ email: req.body.email });
  if (community) {
    return res.redirect(307, "/community/login");
  }
  throw new CustomError("Email not exists", 401);
});

router.post("/unique-email", async (req, res, next) => {
  let email = req.body.email;
  let student = await Student.findOne({ email });
  if (student) {
    return res.json({unique: false});
  }
  let instructor = await Instructor.findOne({ email });
  if (instructor) {
    return res.json({unique: false});
  }
  let community = await Community.findOne({ email });
  if (community) {
    return res.json({unique: false});
  }
  return res.json({unique: true});  
})

router.post("/unique-username", async (req, res, next) => {
  let username = req.body.username;
  let student = await Student.findOne({ username });
  if (student) {
    return res.json({unique: false});
  }
  let instructor = await Instructor.findOne({ username });
  if (instructor) {
    return res.json({unique: false});
  }
  let community = await Community.findOne({ username });
  if (community) {
    return res.json({unique: false});
  }
  return res.json({unique: true});  
})

//Edit user image
router.patch(
  "/image",
  auth,
  fileUpload.single("image"),
  async (req, res, next) => {
    if (!req.file) {
      return next(new CustomError(400, "Please upload an image"));
    }
    if (req.file) {
      const path = req.file.path;
      const image = await cloudinary.uploader.upload(path, {
        tags: "express_sample",
      });
      req.user.image = image.secure_url;
    }
    await req.user.save();
    res.send({ message: "user profile image was updated successfully", user: req.user });
  }
);

//Get User public profile
router.get("/:username", async (req, res) => {
  let username = req.params.username;
  let instructor = await Instructor.findOne({ username }).populate("courses", "title").populate("teaches","username email image");
  if (instructor) {
    return res.json({user: instructor});

  }
  let student = await Student.findOne({ username }).populate("courses", "title").populate("instructedBy","username email image");
  if (student) {
    return res.json({user: student});
  }
  return res.status(404).json({message: "There is no user with such username"});
});

module.exports = router;
