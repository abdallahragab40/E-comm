const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../models/student");
const fileUpload = require("../middleware/file-upload");
const { jwtSecret } = require("../config");

const router = express.Router();

// @route   POST student/signup
// @desc    Register Student
// @access  Public

router.post("/signup", fileUpload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      phoneNumber: req.body.phoneNumber,
      invitationCode: req.body.invitationCode,
      imagePath: url + "/public/images/" + req.file.filename,
    });
    student
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Student Created",
          result,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Invalid authentication credentials" });
      });
  });
});

// @route   POST student/login
// @desc    Register Student
// @access  Public

router.post("/login", (req, res, next) => {
  let fetchedStudent;
  Student.findOne({ email: req.body.email })
    .then((student) => {
      if (!student) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      fetchedStudent = student;
      return bcrypt.compare(req.body.password, student.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      const token = jwt.sign(
        { email: fetchedStudent.email, studentId: fetchedStudent._id },
        jwtSecret,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        token,
        expiresIn: 36000,
        studentId: fetchedStudent._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
});
module.exports = router;
