var express = require("express");
var router = express.Router();
const validateRegisterInput = require("../services/validations/register");
const validateLoginInput = require("../services/validations/login");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/User");
const UserMusic = require("../models/UserMusic");
const auth = require("../middleware/auth");
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const register = (req, res) => {
  const { email, name, password } = req.body;
  const { errors, isValid } = validateRegisterInput(req.body);
  const saltRounds = 10;

  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }

  User.findOne({ name }).then((user) => {
    if (user) {
      return res.status(422).json({ error: "User Already Exists" });
    } else {
      login;
      const newUser = new User({
        name: name,
        email: email,
        password: password,
      });
      bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            if (user) {
              const payload = { id: user._id, email: user.email };
              const token = jwt.sign(payload, process.env.JWT_SECRET);
              res.set(
                "Set-Cookie",
                cookie.serialize("token", token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                  maxAge: 3600,
                  path: "/",
                })
              );
            }
            res.status(200).json({ status: "success", data: { user: user } });
          })
          .catch((err) => {
            res.status(400).json({ message: err.message });
          });
      });
    }
  });
};

const login = (req, res) => {
  const { name, password } = req.body;

  User.findOne({ name }).then((user) => {
    if (!user) {
      return res.status(400).json({ error: "Authentication Failed" });
    }
    bcrypt.compare(password, user.password).then((passwordMatches) => {
      if (passwordMatches) {
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.json({ status: "success", data: { user: user, token } });
      } else {
        return res.status(400).json({ password: "Password is incorrect" });
      }
    });
  });
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.status(200).redirect("/");
};

const authorized = (req, res) => {
  return res.json({ user: res.locals.user });
};

const updateUserMusic = (req, res) => {
  const user = res.locals.user;
  const { album } = req.body;
  const newRecord = new UserMusic({
    user,
    album,
    categoryId: album.categoryId,
  });
  newRecord.save().then((createdRecord) => {
    if (createdRecord) {
      res.status(200).json({ status: "Success", data: createdRecord });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  });
};

const findUserMusic = (req, res) => {
  const user = res.locals.user;
  UserMusic.find({ user })
    .populate({
      path: "albumCollection",
    })
    .populate({
      path: "category",
    })
    .then((userMusics) => {
      res.status(200).json(userMusics);
    })
    .catch((err) => {
      res.status(500).json({ error: err?.message });
    });
};

const deleteUserMusic = (req, res) => {
  const user = res.locals.user;
  const { _id } = req.body;
  UserMusic.deleteOne({ _id })
    .then(() => {
      res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      res.status(500).json({ error: err?.message });
    });
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update-user-music", auth, updateUserMusic);
router.post("/delete-user-music", auth, deleteUserMusic);
router.get("/find-user-music", auth, findUserMusic);
router.get("/auth", auth, authorized);

module.exports = router;
