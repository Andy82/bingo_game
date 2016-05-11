exports.post = function(req, res, next) {
  delete req.session.user;
  res.redirect('/');
};