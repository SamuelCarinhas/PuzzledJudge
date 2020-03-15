const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

let Problem = require('./models/problem');

mongoose.connect(config.database, { useNewUrlParser: true });

let db = mongoose.connection;

//Check connection
mongoose.set('useCreateIndex', true);
db.once('open', () => {
    console.log('OnlineJudge LOG:', 'Connected to MongoDB');
});

//Check for DB errors
db.on('error', (err) => {
    console.log(err);
});


//Routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const problemsRouter = require('./routes/problems');
const logoutRouter = require('./routes/logout');
const rankingRouter = require('./routes/ranking');
const userRouter = require('./routes/user');
const submissionsRouter = require('./routes/submissions');

//App Initialize
const app = express();

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Express Session
app.use(session( {
    secret: 'atomicJudge key',
    resave: true,
    saveUninitialized: true,
}));

//Express Messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator
app.use(expressValidator( {
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

//Passport
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/problems', problemsRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/ranking', rankingRouter);
app.use('/user', userRouter);
app.use('/submissions', submissionsRouter);

app.delete('/problem/:id', (req, res) => {
    let query = {id: req.params.id};

    Problem.remove(query, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.send('Success');
        }
    });
});

//Start Server
app.listen(80, () => {
    console.log('OnlineJudge LOG:', 'Server stared on port 80.');
});