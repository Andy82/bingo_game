exports.get = function(req, res) {
  if(req.session.user){
        var Data = require('models/data').Data;
        Data.find({}, function(err, games) {
          res.render('games',{games: games});
        });
  }
};