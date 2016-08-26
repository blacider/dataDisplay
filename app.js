var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require("./util/logger.js");
var routes = require('./routes/index');
var users = require('./routes/users');
var table = require('./routes/table');
var enterprise = require('./routes/enterprise');
var oracleRoute = require('./routes/oracle.js');
var session = require('express-session');

var utils = require("./modal/util/util.js");

var MySQLStore = require('express-mysql-session')(session);

var MySQLConf = require('./modal/conf/db.js');

var app = express();
var ejs = require('ejs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sessionStore = new MySQLStore(utils.extend({
  createDatabaseTable: true,
  useConnectionPooling: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, MySQLConf.mysql));

app.use(session({
  secret: 'session-secret',
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      path: '/'
    }
}));

app.use(function(req, res, next) {
  var url = req.originalUrl.split("?")[0];
  log.log(url);
  if (!req.session.hasOwnProperty("name")) {
    res.locals.isLogin = false;
    if (url != "/login" && url != "/signup" && url != "/isLogin" && url != "/getCode")
      return res.redirect("/login");
  } else {
    if (url == "/login" || url == "/signup") {
      return res.redirect("/");
    }
    res.locals.isLogin = true;
    res.locals.username = req.session.name;
  }
  next();
});


app.use('/', routes);
app.use('/', users);
// app.use('/', table);
app.use('/', enterprise);
app.use('/', oracleRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
