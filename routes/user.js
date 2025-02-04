const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const userController = require('../controllers/user.js')
const passport = require('passport');

// Signup route
router.post('/signup', wrapAsync(userController.signup));

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    let {username} = req.body
    res.json({ success: true, username:username});
});

// Logout route
router.get('/logout', userController.logout);

module.exports = router