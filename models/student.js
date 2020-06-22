const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { saltRounds, jwtSecret } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const studentSchema = new mongoose.Schema(
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
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    role: { type: String, default: "Student", immutable: true },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    instructedBy: [
      { type: mongoose.Schema.ObjectId, ref: "instructor", required: true },
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
  const token = jwtSign(
    { id: student._id.toString(), role: "student" },
    jwtSecret,
    {
      expiresIn: "1h",
    }
  );
  student.tokens.push({ token });
  return token;
};

studentSchema.statics.getStudentFromToken = async function (token) {
  const { id } = await jwtVerify(token, jwtSecret);
  return this.findById(id);
};

const Student = mongoose.model("student", studentSchema);

module.exports = Student;
