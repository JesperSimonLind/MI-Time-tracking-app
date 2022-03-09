// REQUIRES //

require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    UsersModel,
    TasksModel,
    ForumModel
} = require("../models/Models.js");
const {
    hashPassword,
    comparePassword,
    getUniqueFilename,
} = require("../utils.js");
const bcrypt = require("bcrypt");
const path = require("path");
const {
    default: mongoose
} = require("mongoose");

// ROUTES //

// READ – FORUM
router.get("/:id", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();
    const forumPosts = await ForumModel.find().lean();

    TasksModel.find({
            user: {
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
            },
        },
        function (err, tasks) {
            res.render("forum/forum-dashboard", {
                user,
                tasks,
                forumPosts
            });
        }).lean();
})

// CREATE – ADD POST TO FORUM
router.post("/:id", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();
    const {
        title,
        post
    } = req.body;

    if (post) {
        const newPost = new ForumModel({
            title: title,
            post: post,
            user: {
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
            },
        });
        await newPost.save();
        res.redirect("/forum/" + user._id);
    } else {
        console.log(error)
    }
})

// READ – FORUM LIST
router.get("/:id/list", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();

    TasksModel.find({
            user: {
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
            },
        },
        function (err, tasks) {
            ForumModel.find({
                    user: {
                        _id: user._id,
                        username: user.username,
                        profilePicture: user.profilePicture,
                    }
                },
                (err, myPosts) => {
                    res.render("forum/forum-list", {
                        user,
                        tasks,
                        myPosts
                    });
                }).lean();
        }).lean();
})



// READ – UPDATE POST
router.get("/:userid/:id/update", async (req, res) => {
    const user = await UsersModel.findById(req.params.userid).lean();
    const post = await ForumModel.findById(req.params.id).lean()

    TasksModel.find({
            user: {
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
            },
        },
        function (err, tasks) {
            res.render("forum/forum-update", {
                user,
                tasks,
                post
            });
        }).lean();
})


// POST – UPDATE POST
router.post("/:userid/:id/update", async (req, res) => {
    const user = await UsersModel.findById(req.params.userid).lean();
    const post = await ForumModel.findById(req.params.id).lean()

    console.log(post)

    TasksModel.find({
            user: {
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
            },
        },
        async function (err, tasks) {
            await ForumModel.findByIdAndUpdate({
                _id: req.params.id,
            }, {
                title: req.body.title,
                post: req.body.post,
            });
            res.render("forum/forum-dashboard", {
                user,
                tasks,
                post
            })
        }).lean();
})


module.exports = router;