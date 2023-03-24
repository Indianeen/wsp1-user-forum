const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

/* GET home page. */
router.get('/', function (req, res) {
    return res.json({ msg: 'Hello World' });
});

module.exports = router;

router.get('/login', function (req, res, next){
    
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
    const [users] = await promisePool.query("SELECT * FROM xxxx WHERE name=?", username);

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