// REQUIRES //

require("dotenv").config();
require("./data/mongoose.js");

const express = require('express');
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const utils = require('./data/utils.js');
const usersRouter = require('./data/routes/users-router.js')
const tasksRouter = require('./data/routes/tasks-router.js')

const app = express();

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use("/user", usersRouter);
app.use("/task", tasksRouter);


// ROUTES //

app.get('/', (req, res) => {
    res.send("Hello")
})

app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)


app.use('/', (req, res) => {
    res.status(404).render("not-found")
})

app.listen(8000, () => {
    console.log("http://localhost:8000/");
})