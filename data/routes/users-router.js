const express = require('express')
const router = express.Router()


// ROUTES //

router.get('/', (req, res) => {
    res.send("Hello Users router")
})


module.exports = router;