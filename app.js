const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const session = require("express-session");
const bcrypt = require('bcrypt')
const {db} = require('./config/config')
// console.log(db)
// console.log(typeof db)
mongoose.connect(db).catch(error => console.log(error))

const adminRouter = require("./routes/admin")
const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
const signupRouter = require('./routes/signup');
const signInRouter = require('./routes/signin');
const createArticle = require('./routes/craeteArticle');
const userArticle = require('./routes/userarticle');
const resetPasswordRouter = require('./routes/resetPassword');
const comment = require('./routes/comment');
const { log } = require('console');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.cookies
  next()
})


app.use(
  session(
    {
  key: 'user_seed',
  secret: '1234',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3000000,
  }
}))

app.use('/', indexRouter);
app.use('/admin' , adminRouter)
app.use('/resetPassword', resetPasswordRouter);
app.use('/profile', profileRouter);
app.use('/signup', signupRouter);
app.use('/signIn', signInRouter);
app.use('/createArticle', createArticle);
app.use('/userArticle', userArticle);
app.use('/comment', comment);

app.use((req, res, next) => {
console.log(req.cookies);
  next();
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
