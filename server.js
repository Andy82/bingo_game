var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var favicon = require('serve-favicon');
var methodOverride = require('method-override')
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./lib/log')(module);

var app = express();
app.set('port', config.get('port'));

// req.cookies
app.use(cookieParser());
app.use(favicon(__dirname + '/public/favicon.ico'));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))

// parse application/x-www-form-urlencoded (req.body)
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var sessionStore = require('lib/sessionStore');

session = require("express-session")({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore,
  resave: true,
  saveUninitialized: true
  }),

app.use(session);

app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));

require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  log.info('Express server listening on port ' + app.get('port'));
});


var io = require('./socket')(server, session);
app.set('io', io);

