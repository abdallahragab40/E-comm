const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const courseSchema = new Schema(
  {
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
    keywords: [String],
    duration: Number,
    category: {
      type: String,
      trim: true,
      minlength: [3, "Category is too short"],
      maxlength: [20, "Category is too long"],
    },
    instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "instructor",
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "student",
      },
    ],
    accessCode: {
      type: String,
      // default: uuidv4(),
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "instructor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("course", courseSchema);
