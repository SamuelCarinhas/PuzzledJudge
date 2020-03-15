const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let User = require('../models/user');

router.get('/:username', (req, res) => {
    User.findOne({username: req.params.username}, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            res.render('user', {title: 'Atomic Judge', active: 'none', watchUser: user});
        }
    });
});

module.exports = router;