require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../utils/database.js');
const promisePool = pool.promise();
const { post } = require('../app.js');
/* GET home page. */
userId = "";
router.get('/', async function (req, res) {
    const [rows] = await promisePool.query("SELECT * FROM al07forum")
    res.render('index.njk', {
        rows: rows,
        title: 'ForumX',
    });
});

module.exports = router;

router.get('/login', function (req, res, next){
    res.render('login.njk')
});

router.get('/register', async function(req, res) { 
    res.render('register.njk', { title: 'Register'})
}) 

router.get('/profile', async function (req, res, next) {
    if (req.session.LoggedIn) {
        return res.render('profile.njk', {   
            title: 'Profile', 
            user: req.session.userId, 
        });
    } else {
        
        return res.status(401).send("Access denied");
    }
});

//Innan login anv.namn & pw check

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    const errors = [];

    // Kollar om något fält är tomt
    if (username === "") {
        errors.push("Username is required")
        return res.json(errors)
    } else if (password === "") {
        errors.push("Password is required")
        return res.json(errors)
    }

    // Hämta informationen på användaren
    const [users] = await promisePool.query("SELECT * FROM al07users WHERE name=?", username);

    // om användaren finns eller inte
    if (users.length > 0) {

        bcrypt.compare(password, users[0].password, function (err, result) {
            if (result) {

                req.session.userId = username;
                req.session.LoggedIn = true;
                return res.redirect('/profile');
            } else {
                errors.push("Invalid username or password");
                return res.json(errors);
            }
        });
    } else {
        errors.push("Wrong credentials");
        return res.json(errors);
    }
});

//Efter login anv.namn & pw check

router.post('/delete', async function(req, res, next) {
    if(req.session.LoggedIn) {
        req.session.LoggedIn = false;
        await promisePool.query('DELETE FROM al07users WHERE name=?', req.session.userId);
        res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});

router.post('/logout', async function(req, res, next) {
    console.log(req.session.LoggedIn);
    if(req.session.LoggedIn) {
    req.session.LoggedIn = false;
    res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});


//Innan registrering

router.post('/register', async function(req, res) {
    const { username, password, passwordConfirmation } = req.body;
    const errors = [];

    if (username === "") {
        errors.push("Username is Required")
        return res.json(errors)
    } else if (password === "") {
        errors.push("Password is Required")
        return res.json(errors)
    } else if(password !== passwordConfirmation ){
        errors.push("Passwords do not match")
        return res.json(errors)
    }
    
    const [users] = await promisePool.query("SELECT * FROM al07users WHERE name=?", username);
    
    if (users.length > 0) {
        errors.push("Username is already taken")
        return res.json(errors)
    }
    await bcrypt.hash(password, 10, async function (err, hash) {
        const [rows] = await promisePool.query('INSERT INTO al07users (name, password) VALUES (?, ?)', [username, hash])
        res.redirect('/login');
    }); 
});

//Efter registrering

router.get('/crypt/:pwd', async function (req, res, next) {
    const pwd = req.params.pwd;
    await bcrypt.hash(pwd, 10, function (err, hash) {
        return res.json({ hash });
    });
});

//Innan forum

router.get('/forum', async function (req, res, next) {
    res.render('forum.njk', { title: 'ForumX feed'})
})

router.post('/forum', async function (req, res) {
    const [rows] = await promisePool.query('SELECT al07forum.*, al07users.name FROM al07forum JOIN al07users ON al07forum.authorId = al07users.id;')
})

//Efter forum

//Innan post

router.get('/newpost', async function (req, res, next) {
    res.render('newpost.njk', { title: 'Create new post'})
})

router.post('/newpost', async function (req, res) {
    const [authorId] = await promisePool.query('SELECT id FROM al07user WHERE name=?', username);
    const [rows] = await promisePool.query('INSERT INTO al07forum (authorId, title, content, createdAt) VALUES (?, ?)', [authorId, title, content, time])
})

//Efter post