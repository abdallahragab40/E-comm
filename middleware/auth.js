const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const { jwtSecret } = require("../config");
const createError = require("http-errors");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, jwtSecret);
    const user = await userModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    throw createError(401, "invalid credentials");
  }
};
