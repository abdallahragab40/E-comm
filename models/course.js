const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const courseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: [5, "Title is too short"],
    maxlength: [40, "Title is too long"],
    required: true,
  },
  describtion: {
    type: String,
    trim: true,
    minlength: [20, "Describtion is too short"],
    maxlength: [200, "Describtion is too long"],
    required: true,
  },
  keyWords: [String],
  duration: Number,
  category: {
    type: String,
    trim: true,
    minlength: [3, "Ctegory is too short"],
    maxlength: [20, "Ctegory is too long"],
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
    default: uuidv4(),
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "instructor",
    required: true,
  },
},
{
    timestamps: true
});

module.exports = model("course", courseSchema);
