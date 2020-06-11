const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const communitySchema = new mongoose.Schema({
  fullName: {
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
  description: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
    default: "free",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  imagePath: { type: String, required: true },
});

communitySchema.plugin(uniqueValidator);

const Community = mongoose.model("community", communitySchema);

module.exports = Community;
