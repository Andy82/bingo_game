var checkAuth = require('middleware/checkAuth');

module.exports = function(app) {
  
//app.get('/', function(req, res, next) { res.render("room");});

app.get('/room', function(req, res, next) { res.render("room");});
app.get('/table', function(req, res, next) { res.render("table");});

 app.get('/', require('./frontpage').get);

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.post('/logout', require('./logout').post);

//  app.get('/chat', checkAuth, require('./chat').get);

app.get('/roomX', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});

};
