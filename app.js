var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose')

var cors = require('cors');
var logger = require('morgan');


var adminRouter = require('./routes/admin');
var userRouter = require('./routes/users')

var app = express();
var session = require('express-session')
require('dotenv').config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: '*',
  exposedHeaders: 'Content-Range'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//database connection

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Database Connected');
}).catch((err) => {
  console.log("Database Connection Error - " + err);
})

app.use(session({
  secret: "key",
  cookie: { maxAge: 6000000 },
  resave: true,
  saveUninitialized: true
}))

app.use('/admin', adminRouter);
app.use('/', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
