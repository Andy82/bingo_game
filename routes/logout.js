exports.get = function(req, res) {
  res.redirect('/');
};

exports.post = function(req, res, next) {
  if (req.session.user) {
  delete req.session.user;
  res.redirect('/');
  }
};