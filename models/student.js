const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = new mongoose.Schema({
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
  invitationCode: {
    type: String,
    required: true,
  },
  imagePath: { type: String, required: true },
});

studentSchema.plugin(uniqueValidator);

const Student = mongoose.model("student", studentSchema);

module.exports = Student;
