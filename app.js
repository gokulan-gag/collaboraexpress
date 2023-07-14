var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
const cors = require("cors");

var indexRouter = require("./routes/index");
var wopiRouter = require("./routes/wopi");

// maximum request body size handled by the bodyParser package
// increase it if you need to handle larger files
var maxDocumentSize = "20mb";

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.raw({ limit: maxDocumentSize }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/wopi", wopiRouter);

module.exports = app;
