const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Instructor = require("../models/instructor");
const Community = require("../models/community");
const CustomError = require("../helper/Custom-error");

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

module.exports = router;
