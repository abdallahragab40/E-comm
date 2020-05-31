const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const instructorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  imagePath: { type: String, required: true },
});

instructorSchema.plugin(uniqueValidator);

const Instructor = mongoose.model("instructor", instructorSchema);

module.exports = Instructor;
