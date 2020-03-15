const express = require('express');
const router = express.Router();

let User = require('../models/user');

router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if(err) {
            console.log(err);
        } else {
            res.render('ranking', {title: 'Atomic Judge', active: 'ranking', users: users});
        }
    });
});

module.exports = router;