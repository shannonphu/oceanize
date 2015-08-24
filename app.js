var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

// socket.io server-side

var server = http.createServer(app).listen( 3000 );
var io = require('socket.io').listen(server, function() {
    console.log("Express server listening on port " + app.get('port'));
});

var users = 0;
var people = {};

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (client) {
    users++;
    console.log("Num users: " + users);

    client.on('join', function(name) {
      people[client.id] = name;
      console.log(people);
      io.sockets.emit("chatroom-update", people);
      announce(name + " has joined the chat");
    });

    client.on('announce', function(msg) {
      announce(msg);
    });

    function announce(msg) {
      io.sockets.emit("announcement", msg);
    };

    client.on('process message', function(message) {
      io.sockets.emit('post-message', message, people[client.id]);
    });

    client.on('disconnect', function() {
      users--;
      io.sockets.emit("announcement", people[client.id] + " has left the chat");
      delete people[client.id];
      io.sockets.emit("update-people", people)
      console.log("user disconnected");
    });

});
