const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'Puzzled Judge', active: 'home'});
});

module.exports = router;