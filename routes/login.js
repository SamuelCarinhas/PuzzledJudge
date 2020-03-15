const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.render('login', {title: 'Puzzled Judge', active: 'login'});
    } else {
        res.redirect('/');
    }
});

router.post('/', (req, res, next) => {
    if(req.body.login == 'Login') {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    } else {
        res.redirect('/register');
    }
});

module.exports = router;