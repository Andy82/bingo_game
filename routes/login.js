var User = require('models/user').User;
var AuthError = require('models/user').AuthError;
var async = require('async');

exports.get = function(req, res) {
  res.render('login');
};

exports.post = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.authorize(username, password, function(err, user) {
    if (err) {
        return next(err);
    }

    req.session.user = user._id;
    res.send({});

  });

};