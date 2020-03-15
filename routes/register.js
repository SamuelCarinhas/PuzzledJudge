const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let User = require('../models/user');

router.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.render('register', {title: 'Puzzled Judge', active: 'register'});
    } else {
        res.redirect('/');
    }
});

router.post('/', (req, res) => {
    if(req.body.register == 'Register') {
        const email = req.body.email.toLowerCase();
        const username = req.body.username.toLowerCase();
        const fullName = req.body.fullName;
        const password = req.body.password;

        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('fullName', 'Full name is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();

        let errors = req.validationErrors();

        if(errors) {
            res.render('register', {
                errors: errors
            });
        } else {
            let newUser = new User( {
                email:email,
                username:username,
                fullName:fullName,
                password:password,
                rank:'Member',
                country:'None'
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) {
                        console.log(err);       
                    } else {
                        newUser.password = hash;
                        newUser.save((err) => {
                            if(err) {
                                if(err.errors.email) {
                                    req.flash('error', err.errors.email.message);
                                } else if(err.errors.username) {
                                    req.flash('error', err.errors.username.message);
                                } else {
                                    console.log(err);
                                }
                                res.redirect('/register');
                            } else {
                                req.flash('success', 'You are now registered');
                                res.redirect('/login');
                            }
                        });
                    }
                });
            });
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;