require("express-async-errors");
require("./db");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const { port } = require("./config");

var indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const instructorRouter = require("./routes/instructor");
const communityRouter = require("./routes/community");
const studentRouter = require("./routes/student");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/instructor", instructorRouter);
app.use("/community", communityRouter);
app.use("/student", studentRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "Couldn't find this route"));
});

// error handler
app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res.status(err.status || 500);
  res.send({ message: err.message || "Something went wrong" });
});

app.listen(port, () => console.log(`server listening on port ${port}`));
