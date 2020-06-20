const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const _ = require("lodash");
const Plans = require("../helper/plans");
const { saltRounds, jwtSecret } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const communitySchema = new mongoose.Schema(
  {
    name: {
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
    description: {
      type: String,
      required: true,
      maxlength: [200, "too long"],
    },
    plan: {
      type: String,
      required: true,
      enum: Plans,
      default: "free",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dkohnctot/image/upload/v1592512933/profile_pfhamn.jpg",
    },
    country: String,
    city: String,
    address: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform: ({ _doc }) => _.omit(_doc, ["__v", "password"]),
    },
  }
);

communitySchema.plugin(uniqueValidator);

communitySchema.pre("save", async function (next) {
  const community = this;
  if (community.isModified("password")) {
    community.password = await bcrypt.hash(
      community.password,
      Number(saltRounds)
    );
  }
  next();
});

communitySchema.methods.checkPassword = async function (plainPassword) {
  const community = this;
  return bcrypt.compare(plainPassword, community.password);
};

communitySchema.methods.generateToken = function () {
  const community = this;
  return jwtSign({ id: community.id, role: "community" }, jwtSecret, {
    expiresIn: "12h",
  });
};

communitySchema.statics.getCommunityFromToken = async function (token) {
  const { id } = await jwtVerify(token, jwtSecret);
  return this.findById(id);
};

module.exports = mongoose.model("community", communitySchema);
