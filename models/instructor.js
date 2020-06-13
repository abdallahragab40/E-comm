const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const { saltRounds, jwtSecret } = require("../config");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const instructorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "too short"],
      maxlength: [30, "too long"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "too short"],
      maxlength: [30, "too long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: [true, "This email is already registered"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: [7, "too short"],
      maxlength: [30, "too long"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    imagePath: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: ({ _doc }) => _.omit(_doc, ["__v", "password"]),
    },
  }
);

instructorSchema.plugin(uniqueValidator);

instructorSchema.pre("save", async function (next) {
  const instructor = this;
  if (instructor.isModified("password")) {
    instructor.password = await bcrypt.hash(
      instructor.password,
      Number(saltRounds)
    );
  }
  next();
});

instructorSchema.methods.checkPassword = async function (plainPassword) {
  const instructor = this;
  return bcrypt.compare(plainPassword, instructor.password);
};

instructorSchema.methods.generateToken = function () {
  const instructor = this;
  return jwtSign({ id: instructor.id, role: "instructor" }, jwtSecret, {
    expiresIn: "1h",
  });
};

instructorSchema.statics.getInstructorFromToken = async function (token) {
  const { id } = await jwtVerify(token, jwtSecret);
  return this.findById(id);
};

const Instructor = mongoose.model("instructor", instructorSchema);

module.exports = Instructor;
