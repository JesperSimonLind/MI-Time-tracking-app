const express = require('express')
const router = express.Router()


// ROUTES //

router.get('/', (req, res) => {
    res.send("Hello Users router")
})

router.get('/signup', (req, res) => {
    res.render('users/users-create')
})

router.get('/dashboard', (req, res) => {
    res.render('users/users-dashboard')
})


module.exports = router;