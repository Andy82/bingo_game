module.exports = function(req, res, next) {
  if (!req.session.user) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
};

//http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291