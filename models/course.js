const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: [5, "Title is too short"],
    maxlength: [40, "Title is too long"],
    required: true,
  },
  description: {
    type: String,
    trim: true,
    minlength: [20, "Description is too short"],
    maxlength: [200, "Description is too long"],
    required: true,
  },
  keyWords: [String],
  category: {
    type: String,
    trim: true,
    minlength: [3, "Category is too short"],
    maxlength: [20, "Category is too long"],
  },
  accessCode: {
    type: String,
    trim: true,
    required: true
  },
  instructors: [
    {
      type: Schema.Types.ObjectId,
      ref: "instructor",
    },
  ],
  community: {
    type: Schema.Types.ObjectId,
    ref: "community",
    required: true,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "student",
    },
  ],
});

module.exports = model("course", courseSchema);
