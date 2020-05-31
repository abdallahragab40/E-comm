const express = require("express");
const router = express.Router();
const validateRequest = require("../middleware/validateRequest");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const userModel = require("../models/user");
const fileUpload = require("../middleware/file-upload");
const createError = require("http-errors");
var cloudinary = require("cloudinary").v2;

//Register a user with the following required attributes Username, password, firstName
router.post(
  "/signup",
  fileUpload.single("image"),
  validateRequest([
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 50 }),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least  8 characters long"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address"),
  ]),
  async (req, res) => {
    if (!req.file) throw createError(422, "Profile Image is required");
    const path = req.file.path.replace("public\\", "");
    const image = await cloudinary.uploader.upload(path, {
      tags: "express_sample",
    });
    req.body.image = image.secure_url;
    const user = new userModel(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    user.tokens.push({ token });
    res
      .status(201)
      .send({ message: "user was registered successfully", user, token });
  }
);

//Login a user after checking credentials
router.post(
  "/login",
  validateRequest([
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ]),
  async (req, res, next) => {
    const user = await userModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({
      message: "logged in successfully",
      user,
      token,
    });
  }
);

//Logout a user
router.post("/logout", auth, async (req, res) => {
  req.user.tokens = req.user.tokens.filter(
    (token) => token.token !== req.token
  );
  await req.user.save();
  res.send({ message: "user was logged out successfully" });
});

//Logout a user from all sessions
router.post("/logoutAll", auth, async (req, res) => {
  req.user.tokens = [];
  await req.user.save();
  res.send({ message: "user was logged out from all sessions successfully" });
});

//Change Password
router.patch(
  "/me/password",
  auth,
  validateRequest([
    check("oldPassword")
      .not()
      .isEmpty()
      .withMessage("Old password is required"),
    check("newPassword")
      .not()
      .isEmpty()
      .withMessage("new password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least  8 characters long"),
  ]),
  async (req, res, next) => {
    const user = await userModel.findByCredentials(
      req.user.email,
      req.body.oldPassword
    );
    user.password = req.body.newPassword;
    await user.save();
    res.send({ message: "user Password was updated successfully" });
  }
);

//Delete user
router.delete("/", auth, async (req, res) => {
  const user = await userModel.findByCredentials(
    req.user.email,
    req.body.Password
  );
  await user.remove();
  res.send({ message: "user was deleted successfully" });
});

module.exports = router;