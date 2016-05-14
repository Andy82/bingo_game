exports.get = function(req, res) {
  if(req.session.user){
        var User = require('models/user').User;
        User.find({}, function(err, users) {
          res.render('users',{users: users});
        });
  }
};