const CustomError = require("../helper/custome-error");

const role = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.role)) {
      next();
    } else {
      throw new CustomError("Access denied", 403);
    }
  };
};

module.exports = role;