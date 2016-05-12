exports.get = function(req, res) {
  if(req.session.user){
    var data = {user: req.session.user}
      res.render('table', data);
  }
};