var User = require('models/user').User;

exports.get = function(req, res) {
  //res.render('users');
  res.redirect('/app/users');
};

exports.apiGet = function(req, res) {
        User.find({}, function(err, users) {
          if (err) res.send(err);
          res.json(users); 
        });
};

exports.apiPost = function(req, res) {
        // create user, information comes from AJAX request from Angular
        
        console.log(req.body.text);
        User.create({
                username : req.body.text,
                password : "",
                done : false
        }, function(err, users) {
            if (err) res.send(err);

            // get and return all users after you create another
            User.find(function(err, users) {
                if (err) res.send(err);
                res.json(users);
            });
        });

};
        
exports.apiDelete = function(req, res) {
        User.remove({
            _id : req.params.user_id
        }, function(err, users) {
            if (err) res.send(err);

            // get and return all users after you create another
            User.find(function(err, users) {
                if (err) res.send(err)
                res.json(users);
            });
        });
};