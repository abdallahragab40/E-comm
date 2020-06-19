const jwt = require("jsonwebtoken");
const { getUserByRole } = require("../controllers");
const { jwtSecret } = require("../config");
const createError = require("http-errors");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const { id, role } = jwt.verify(token, jwtSecret);
    req.role = role;
    req.user = await getUserByRole(role, id);
    next();
  } catch (error) {
    throw createError(401, "invalid credentials");
  }
};
