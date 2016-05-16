var mongoose = require('lib/mongoose');

  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  Data = new Schema({
  chosenNumber: {
    type: String
  }
  
});
exports.Data = mongoose.model('Data', Data);
