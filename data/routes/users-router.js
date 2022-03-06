// REQUIRES //

require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UsersModel, TasksModel } = require("../models/Models.js");
const {
  hashPassword,
  comparePassword,
  getUniqueFilename,
} = require("../utils.js");
const bcrypt = require("bcrypt");
const path = require("path");
const { default: mongoose } = require("mongoose");

// ROUTES //

// 404 PAGE
router.get("/", (req, res) => {
  res.status(404).render("not-found");
});

// LOG IN PAGE

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  UsersModel.findOne(
    {
      username,
    },
    (e, user) => {
      if (user && comparePassword(password, user.password)) {
        const userData = {
          userId: user._id.toString(),
          username,
        };
        const accessToken = jwt.sign(userData, process.env.JWTSECRET);
        res.cookie("token", accessToken);

        res.redirect("/users/" + user._id + "/dashboard");
      } else {
        res.render("not-found");
      }
    }
  );
});

// READ - SIGN UP PAGE
router.get("/signup", (req, res) => {
  res.render("users/users-create");
});

// POST – SIGN UP PAGE
router.post("/signup", async (req, res) => {
  const { username, password, email, profilePic } = req.body;

  const usernameTaken =
    "That username is already taken! Please pick another one.";

  UsersModel.findOne(
    {
      username,
    },
    async (error, user) => {
      if (user) {
        res.render("users/users-create", {
          usernameTaken,
        });
      } else {
        if (req.files != null) {
          // Profile picture (image upload)
          const image = req.files.profilePic;
          const filename = getUniqueFilename(image.name);
          const uploadPath = path.join(
            __dirname,
            "../../public/uploads",
            filename
          );
          await image.mv(uploadPath);

          const newUser = new UsersModel({
            username: username,
            password: hashPassword(password),
            email: email,
            profilePicture: "/uploads/" + filename,
          });
          await newUser.save();
          res.redirect("/users/" + newUser._id + "/dashboard");
        } else {
          const newUser = new UsersModel({
            username: username,
            password: hashPassword(password),
            email: email,
            profilePicture: "",
          });
          await newUser.save();
          res.redirect("/users/" + newUser._id + "/dashboard");
        }
      }
    }
  );
});

// READ - DASHBOARD

router.get("/dashboard", (req, res) => {
  res.status(404).render("not-found");
});

router.get("/:id/dashboard", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();

    TasksModel.find({
        private: false
    }, function (err, publicTasks) {    
    // console.log(publicTasks)
    }).lean()


    TasksModel.find({
        user: user._id
    }, function (err, tasks) {
        res.render("users/users-dashboard", {
            tasks,
            user
        });

    }).lean();
});

// SIGN OUT
router.get("/signout", async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
  });
  res.redirect("/");
});

// READ – UPDATE USER
router.get("/:id/update", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  res.render("users/users-update", {
    user,
  });
});

// POST – UPDATE USER
router.post("/:id/update", async (req, res) => {
  // Profile picture (image upload)
  const image = req.files.profilePic;
  const filename = getUniqueFilename(image.name);
  const uploadPath = path.join(__dirname, "../../public/uploads", filename);
  await image.mv(uploadPath);

  const { token } = req.cookies;

  await UsersModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      username: req.body.username,
      password: hashPassword(req.body.password),
      email: req.body.email,
      admin: false,
      profilePicture: "/uploads/" + filename,
    }
  );

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.redirect("/users/" + tokenData.userId + "/dashboard");
  }
});

// READ – DELETE USER ACCOUNT
router.get("/:id/delete", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  res.render("users/users-delete", {
    user,
  });
});

// POST – DELETE USER ACCOUNT
router.post("/:id/delete", async (req, res) => {
  await UsersModel.findByIdAndDelete(req.params.id);
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
