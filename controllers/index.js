const Student = require("../models/student");
const Instructor = require("../models/instructor");
const Community = require("../models/community");

const getUserByRole = (role, id) => {
  switch (role) {
    case "student":
      return Student.findById(id).populate("courses");
    case "instructor":
      return Instructor.findById(id).populate("courses");
  }
};

module.exports = {
  getUserByRole,
};
