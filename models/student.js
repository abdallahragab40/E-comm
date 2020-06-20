const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const _ = require("lodash");

const { saltRounds, jwtSecret } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const studentSchema = new mongoose.Schema(
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
    imagePath: { type: String },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: ({ _doc }) => _.omit(_doc, ["__v", "password"]),
    },
  }
);

studentSchema.plugin(uniqueValidator);

studentSchema.pre("save", async function (next) {
  const student = this;
  if (student.isModified("password")) {
    student.password = await bcrypt.hash(student.password, Number(saltRounds));
  }
  next();
});

studentSchema.methods.checkPassword = async function (plainPassword) {
  const student = this;
  return bcrypt.compare(plainPassword, student.password);
};

studentSchema.methods.generateToken = function () {
  const student = this;
  return jwtSign({ id: student.id, role: "student" }, jwtSecret, {
    expiresIn: "12h",
  });
};

studentSchema.statics.getStudentFromToken = async function (token) {
  const { id } = await jwtVerify(token, jwtSecret);
  return this.findById(id);
};

const Student = mongoose.model("student", studentSchema);

module.exports = Student;
