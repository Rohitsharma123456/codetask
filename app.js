var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');
var RecommdationRouter = require('./routes/Recommdation.router');
var users=require("./routes/User.routes")

var app = express();
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'supersecretkeytojusttest', // Change this to a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const checkSession = (req, res, next) => {
   
  const user_id = req.session.userId
  

  if (user_id) {
   
    next();
  } else {
    res.redirect('/users/login');
    // res.status(401).json({ error: 'Not Authorized' });
  }
};
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/recommndations',checkSession, RecommdationRouter);
app.use('/users', users);
app.use('/', users);

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
