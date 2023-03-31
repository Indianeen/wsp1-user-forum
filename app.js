require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

const indexRouter = require('./routes/index');

const app = express();

/*var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  LoggedIn: false,
}));*/

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
