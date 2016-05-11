var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var favicon = require('serve-favicon');
var session = require('express-session')
var methodOverride = require('method-override')
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./lib/log')(module);

var app = express();
app.set('port', config.get('port'));

//app.use(bodyParser());
app.use(cookieParser());
app.use(favicon(__dirname + '/public/favicon.ico'));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var sessionStore = require('lib/sessionStore');

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));


app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));

require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  log.info('Express server listening on port ' + app.get('port'));
});


var io = require('./socket')(server);
app.set('io', io);