const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        req.logout();
        req.flash('success', 'You are logged out');
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;