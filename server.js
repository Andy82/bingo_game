var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./lib/log')(module);

var app = express();
app.set('port', config.get('port'));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.favicon());
app.use(express.urlencoded());
app.use(app.router);

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var sessionStore = require('lib/sessionStore');

app.use(express.session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore
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