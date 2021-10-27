var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cors = require("cors");
require("dotenv").config();
var app = express();
const Category = require("./models/Category");
const Album = require("./models/Album");
const ObjectId = require("mongodb").ObjectID;
const originAddress = "http://localhost:8080";
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
const corsOptions = {
  credentials: true, // This is important.
  origin: originAddress,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", originAddress);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use("/api/users", usersRouter);

app.get("/api/categories", (req, res) => {
  Category.find()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  Category.findById(id)
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/categories/:id/albums", async (req, res) => {
  const { id } = req.params;
  const albums = await Album.find({
    categoryId: ObjectId(id),
  });
  res.status(200).json(albums);
});

app.get("/api/albums", (req, res) => {
  Album.find()
    .then((albums) => {
      res.status(200).json(albums);
    })
    .catch((err) => {
      console.log(err);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const url = process.env.MONGO_URL;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
module.exports = app;
