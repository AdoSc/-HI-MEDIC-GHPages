const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const favicon = require("serve-favicon");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set("port", port);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(favicon(path.join("public", "favicon.ico")));

app.use("/", require("./routes/employee.routes"));

module.exports = app;
