const express = require('express')
const router = express.Router()


// ROUTES //

router.get('/', (req, res) => {
    res.send("Hello Tasks router")
})

router.get('/list', (req, res) => {
    res.render('tasks/tasks-list')
})


module.exports = router;