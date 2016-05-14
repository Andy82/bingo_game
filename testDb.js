//var mongoose = require('mongoose'),
//    Schema = mongoose.Schema;

//var db = mongoose.connect('mongodb://localhost/db');

//var User = new Schema({
// first_name: String,
//  last_name: String
//});

//var UserModel = mongoose.model('User', User);

var UserModel = require('models/user').User;

//var record = new UserModel();

//record.first_name = 'hello';
//record.last_name = 'world';

//record.save(function (err) {

  UserModel.find({}, function(err, users) {

    for (var i=0, counter=users.length; i < counter; i++) {

      var user = users[i];

      //console.log( "User => _id: " + user._id + ", first_name: " + user.first_name + ", last_name: " + user.last_name );
      
      console.log( "User => _id: " + user._id + ", userName: " + user.username + ", created: " + user.created );

    }

 // });

});