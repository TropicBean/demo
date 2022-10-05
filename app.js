const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRouter = require('./routes/products')

const session = require("express-session")
const passport = require('./bin/passportconfig')


//Get .env variables
require('dotenv').config()


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : false}))
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'))
//app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false, 
    saveUninitialized: true ,
    cookie: {maxAge : 60*60*100000}
}))

app.use(passport.initialize())
app.use(passport.session())


/* possibly remove - from google strat
*/


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
