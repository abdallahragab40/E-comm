const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Community = require("../models/community");
const fileUpload = require("../middleware/file-upload");
const { jwtSecret } = require("../config");

const router = express.Router();

// @route   POST community/signup
// @desc    Register Community
// @access  Public

router.post("/signup", fileUpload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const community = new Community({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hash,
      description: req.body.description,
      plan: req.body.plan,
      phoneNumber: req.body.phoneNumber,
      imagePath: url + "/public/images/" + req.file.filename,
    });
    community
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Community Created",
          result,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Invalid authentication credentials" });
      });
  });
});

// @route   POST community/login
// @desc    Register Community
// @access  Public

router.post("/login", (req, res, next) => {
  let fetchedCommunity;
  Community.findOne({ email: req.body.email })
    .then((community) => {
      if (!community) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      fetchedCommunity = community;
      return bcrypt.compare(req.body.password, community.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      const token = jwt.sign(
        { email: fetchedCommunity.email, communityId: fetchedCommunity._id },
        jwtSecret,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        token,
        expiresIn: 36000,
        communityId: fetchedCommunity._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
});
module.exports = router;
