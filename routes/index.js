var checkAuth = require('middleware/checkAuth');

module.exports = function(app) {
  
app.get('/room',checkAuth, require('./room').get);
app.get('/table',checkAuth, require('./table').get);

app.get('/', require('./frontpage').get);

app.get('/login', require('./login').get);
app.post('/login', require('./login').post);

app.get('/logout', require('./logout').get);
app.post('/logout', require('./logout').post);

};
