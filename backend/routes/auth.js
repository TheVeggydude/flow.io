const express = require('express');
const router = express.Router();
const User = require('../model/User');

// Registers a new user
router.post('/register', async (req, res) => {
    const user = new User({
        name : req.body.name,
        password : req.body.password
    });

    // TODO validate user

    try {
        const savedUser = await user.save();
        res.status(200).send(`User created!`)
    } catch (err) {
        res.status(400).send(err);
    }
});


router.post('/login', async (req, res) => {

});


// This router is kind of a mini-app that can be attached to other, existing, apps simply by importing it and
// calling app.use(imported_router_variable)
module.exports = router;