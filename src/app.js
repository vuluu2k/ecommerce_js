require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverloadConnect } = require("./helpers/check.connect");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init database
require("./dbs/init.mongodb");
checkOverloadConnect();

// init router
app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

module.exports = app;
