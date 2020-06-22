const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const { saltRounds, jwtSecret } = require("../config");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const instructorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
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
      minlength: [8, "too short"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dkohnctot/image/upload/v1592512933/profile_pfhamn.jpg",
    },
    about: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    plan: {
      type: String,
      trim: true,
      default: "free"
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    teaches: [{ type: mongoose.Schema.ObjectId, ref: "student" }],
    role: {type: String, default: "Instructor", immutable: true},
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.tokens;
      },
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
  const token = jwtSign(
    { id: instructor._id.toString(), role: "instructor" },
    jwtSecret,
    {
      expiresIn: "1h",
    }
  );
  instructor.tokens.push({ token });
  return token;
};

instructorSchema.statics.getInstructorFromToken = async function (token) {
  const { id } = await jwtVerify(token, jwtSecret);
  return this.findById(id);
};

const Instructor = mongoose.model("instructor", instructorSchema);

module.exports = Instructor;
