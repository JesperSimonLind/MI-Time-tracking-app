const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    UsersModel,
    TasksModel
} = require("../models/Models.js");
const {
    hashPassword,
    comparePassword,
    validateUser
} = require("../utils.js");

// ROUTES //

// 404 PAGE
router.get("/", (req, res) => {
    res.status(404).render("not-found");
});

// POST: LOG IN PAGE

router.post("/", async (req, res) => {
    const {
        username,
        password
    } = req.body;

    UsersModel.findOne({
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

// GET: DASHBOARD
router.get("/:id/dashboard", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();
    const tasks = await TasksModel.find()
    console.log(user._id)

    tasks.forEach(task => {
           if (task.user == user._id) {
           console.log(task)
            }
    })

    res.render("users/users-dashboard", {
        user
    });
});

// GET: SIGNUP PAGE
router.get("/signup", (req, res) => {
    res.render("users/users-create");
});

// POST: SIGNUP PAGE

router.post("/signup", async (req, res) => {
    const {
        username,
        password,
        email,
        profilePic
    } = req.body;

    const usernameTaken =
        "That username is already taken! Please pick another one.";

    UsersModel.findOne({
        username
    }, async (error, user) => {
        if (user) {

            res.render("users/users-create", {
                usernameTaken
            });
        } else {
            const newUser = new UsersModel({
                username: username,
                password: hashPassword(password),
                email: email,
                profilePicture: profilePic,
            });
            await newUser.save();

            res.redirect("/users/" + newUser._id + "/dashboard");
        }
    });
});

// GET: Signout
router.get("/signout", async (req, res) => {
    res.cookie("token", "", {
        maxAge: 0,
    });
    res.redirect("/");
});


// GET: USER UPDATE SETTINGS
router.get("/:id/update", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean()
    res.render("users/users-update", {
        user
    });
});

// POST: UPDATE USER SETTINGS
router.post("/:id/update", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean()

    UsersModel.findByIdAndUpdate(
        user.id,
        {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            new: true
        },
        (error, docs, result) => {
            if (error) throw error;
            res.render("users/" + user.id + "/dashboard");
        }
    );

})

// GET: DELETE ACCOUNT PAGE
router.get("/:id/delete", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean()
    res.render("users/users-delete", {
        user
    });
});

// GET: DELETE ACCOUNT PAGE
router.post("/:id/delete", async (req, res) => {
    await UsersModel.findByIdAndDelete(req.params.id)
    res.clearCookie("token");
    res.redirect('/')
});


module.exports = router;