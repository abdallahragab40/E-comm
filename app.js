require("express-async-errors");
require("./db");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const { port } = require("./config");

const usersRouter = require("./routes/users");
const instructorRouter = require("./routes/instructor");
const communityRouter = require("./routes/community");
const studentRouter = require("./routes/student");
const coursesRouter = require("./routes/courses");
const faqsRouter = require("./routes/faqs");
const calendarRouter = require("./routes/calendar");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/instructor", instructorRouter);
app.use("/community", communityRouter);
app.use("/student", studentRouter);
app.use("/courses", coursesRouter);
app.use("/faqs", faqsRouter);
app.use("/calendar", calendarRouter);

// Error Handler
app.use((error, req, res, next) => {
  const message = error.message;
  const statusCode = error.statusCode || 422;
  if (statusCode < 500) {
    res.status(statusCode).json({ ...error, message });
  } else {
    res.json({ ...error, message });
  }
});

app.listen(port, () => console.log(`server listening on port ${port}`));
