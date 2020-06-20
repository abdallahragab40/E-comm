const Student = require("../models/student");
const Instructor = require("../models/instructor");
const Community = require("../models/community");

const getUserByRole = (role, id) => {
  switch (role) {
    case "student":
      return Student.findById(id);
    case "instructor":
      return Instructor.findById(id);
    case "community":
      return Community.findById(id);
  }
};

module.exports = {
  getUserByRole,
};
