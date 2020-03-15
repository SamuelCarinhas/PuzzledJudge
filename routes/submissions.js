const express = require('express');
var fs = require('fs');
const router = express.Router();

let Submission = require('../models/submission');

router.get('/', (req, res) => {
    Submission.find({}, (err, submissions) => {
        if(err) {
            console.log(err);
        } else {
            res.render('submissions', {title: 'Puzzled Judge', active: 'submissions', submissions: submissions.reverse()});
        }
    });
});

router.get('/id/:id', (req, res) => {
    Submission.findOne({fileName: req.params.id}, (err, submission) => {
        if(err) {
            console.log(err);
        } else {
            if(req.user && ((req.user.username == submission.username) || req.user.rank == 'Admin')) {
                var name = "./uploads/" + req.params.id;
                var data = fs.readFileSync(name, 'utf8');
                res.render('submission', {title: 'Puzzled Judge', active: 'submissions', text: data});
            } else {
                Submission.find({}, (err, submissions) => {
                    if(err) {
                        console.log(err);
                    } else {
                        res.redirect('/submissions');
                    }
                });
            }
        }
    });
});

module.exports = router;