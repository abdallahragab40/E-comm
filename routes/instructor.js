const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Instructor = require("../models/instructor");
const fileUpload = require("../middleware/file-upload");
const { jwtSecret } = require("../config");

const router = express.Router();

// @route   POST instructor/signup
// @desc    Register Instructor
// @access  Public

router.post("/signup", fileUpload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const instructor = new Instructor({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      phoneNumber: req.body.phoneNumber,
      imagePath: url + "/public/images/" + req.file.filename,
    });
    instructor
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Instructor Created",
          result,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Invalid authentication credentials" });
      });
  });
});

// @route   POST instructor/login
// @desc    Register Instructor
// @access  Public

router.post("/login", (req, res, next) => {
  let fetchedInstructor;
  Instructor.findOne({ email: req.body.email })
    .then((instructor) => {
      if (!instructor) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      fetchedInstructor = instructor;
      return bcrypt.compare(req.body.password, instructor.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      const token = jwt.sign(
        { email: fetchedInstructor.email, instructorId: fetchedInstructor._id },
        jwtSecret,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        token,
        expiresIn: 36000,
        instructorId: fetchedInstructor._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
});
module.exports = router;
