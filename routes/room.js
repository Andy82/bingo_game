exports.get = function(req, res) {
  if(req.session.user){
      res.render('room');
  }
};