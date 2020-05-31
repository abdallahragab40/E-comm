const mongoose = require("mongoose");
const { mongoURI } = require("./config");

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to Mongo successfully");
  });
