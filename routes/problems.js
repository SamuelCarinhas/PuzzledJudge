const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

var date;

const storage = multer.diskStorage( {
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        date = Date.now();
        cb(null, date+'-'+file.originalname)
    }
});

const upload = multer({ storage });

let Problem = require('../models/problem');
let Submission = require('../models/submission');

router.get('/', (req, res) => {
    Problem.find({}, (err, problems) => {
        if(err) {
            console.log(err);
        } else {
            res.render('problems', {title: 'Puzzled Judge', active: 'problems', problems: problems});
        }
    });
});

router.get('/create', (req, res) => {
    if(req.user && req.user.rank == 'Admin') {
        res.render('problemCreator', {title: 'Puzzled Judge', active: 'createProblem'});
    } else {
        res.redirect('/problems');
    }
});

router.get('/id/:id', (req, res) => {
    Problem.findOne({id: req.params.id}, (err, problem) => {
        if(err) {
            console.log(err);
        } else {
            res.render('problem', {title: 'Puzzled Judge', active: 'problems', problem: problem});
        }
    });
});

router.get('/edit/:id', (req, res) => {
    if(req.user && req.user.rank == 'Admin') {
        Problem.findOne({id: req.params.id}, (err, problem) => {
            var input_formated = '';
            var output_formated = '';
            for(var i = 0; i < problem.inputs.length; i++) {
                input_formated += problem.inputs[i];
                if(i < problem.inputs.length -1) {
                    input_formated += '-END INPUT-\r\n';
                }
            }
            for(var i = 0; i < problem.outputs.length; i++) {
                output_formated += problem.outputs[i];
                if(i < problem.outputs.length -1) {
                    output_formated += '-END OUTPUT-\r\n';
                }
            }
            res.render('problemEditor', {title: 'Puzzled Judge', active: 'problems', problem: problem, outputs: output_formated, inputs: input_formated});
        });
    } else {
        res.redirect('/problems');
    }
});

router.get('/remove/:id', (req, res) => {
    if(req.user && req.user.rank == 'Admin') {
        Problem.deleteOne({id: req.params.id}, (err, problem) => {
            res.redirect("/problems");
        });
    } else {
        res.redirect('/problems');
    }
});

router.post('/id/:id', upload.single('fileSubmit'), (req, res) => {
    try {
        console.log('OnlineJudge LOG:', 'User', req.user.username, 'has submited problem', req.params.id, 'file:', date + req.file.originalname);

        if(req.file.originalname.endsWith(".java") || req.file.originalname.endsWith(".cpp") || req.file.originalname.endsWith(".c") || req.file.originalname.endsWith(".py")) {
            let submission = new Submission();
            submission.id = 0;
            submission.username = req.user.username;
            submission.problem = req.params.id;
            submission.status = 'pending';
            submission.fileName = date + "-" + req.file.originalname;
            
            submission.save((err) => {
                if(err) {
                    console.log(err);
                } else {
                    req.flash('success', 'Problem submited');
                }
            });
            res.redirect('/submissions');
        } else {
            req.flash('error', 'Invalid File');
            res.redirect('/problems/id/' + req.params.id);
        }
    } catch(err) {
        res.redirect('/problems/id/' + req.params.id);
    }
});

router.post('/create', (req, res) => {

    req.checkBody('id', 'Id is required').notEmpty();
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('difficulty', 'Difficulty is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('input', 'Input is required').notEmpty();
    req.checkBody('output', 'Output is required').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.render('problemCreator', {
            title: 'Atomic Judge',
            active: 'none',
            errors: errors
        });
    } else {
        let problem = new Problem();
        problem.id = req.body.id;
        problem.title = req.body.title;
        problem.difficulty = req.body.difficulty;
        problem.author = req.body.author;
        problem.description = req.body.description;
        problem.input = req.body.input;
        problem.output = req.body.output;
        problem.input_example = req.body.input_example;
        problem.output_example = req.body.output_example;
        problem.inputs = req.body.inputs.split('-END INPUT-\r\n');
        problem.outputs = req.body.outputs.split('-END OUTPUT-\r\n');
        
        problem.save((err) => {
            if(err) {
                console.log(err);
            } else {
                req.flash('success', 'Problem created');
                res.redirect('/');
            }
        });
    }
});

router.post('/edit/:id', (req, res) => {
    let problem = {};
    problem.id = req.body.id;
    problem.title = req.body.title;
    problem.difficulty = req.body.difficulty;
    problem.author = req.body.author;
    problem.description = req.body.description;
    problem.input = req.body.input;
    problem.output = req.body.output;
    problem.input_example = req.body.input_example;
    problem.output_example = req.body.output_example;
    problem.inputs = req.body.inputs.split('-END INPUT-\r\n');
    problem.outputs = req.body.outputs.split('-END OUTPUT-\r\n');

    let query = {id:req.params.id}
    
    Problem.update(query, problem, (err) => {
        if(err) {
            console.log(err);
        } else {
            req.flash('success', 'Problem updated');
            res.redirect('/problems/id/' + problem.id);
        }
    });
});



module.exports = router;