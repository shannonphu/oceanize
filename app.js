var express      = require( "express"   );
var socket_io    = require( "socket.io" );

// Express
var app          = express();

// Socket.io
var io           = socket_io();
app.io           = io;

module.exports = app;


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


 process.env.PWD = process.cwd();

 app.use('/', express.static(process.env.PWD+'/public'));

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


var users = 0;
var people = {};

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (client) {
    users++;

    client.on('join', function(name) {
      if (people[client.id])
      	  announce(people[client.id] + " has changed their name to " + name + ".");
      else 
	      announce(name + " has joined the chat.");

	  people[client.id] = name;
	  io.sockets.emit("chatroom-update", people);
    });

    client.on('announce', function(msg) {
      announce(msg);
    });

    function announce(msg) {
      io.emit("announcement", msg);
    };

    client.on('process message', function(message) {
      io.sockets.emit('post-message', message, people[client.id]);
    });

    client.on('disconnect', function() {
      users--;
      var disconnectedUser = people[client.id];
      if (disconnectedUser)
        io.sockets.emit("announcement", people[client.id] + " has left the chat.");
      else
        io.sockets.emit("announcement", "A stranger has left the chat.");
      delete people[client.id];
      io.sockets.emit("chatroom-update", people);
    });

});
