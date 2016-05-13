Game = require('./game.js');
Table = require('./table.js');
var uuid = require('node-uuid');

function Utility () {};

Utility.prototype.createSampleTables = function(tableListSize) {
	var tableList = [];
	for(var i = 0; i < tableListSize; i++){
		var game = new Game();
		var table = new Table(uuid.v4());
		table.setName("Bingo room " + (i + 1));
		table.gameObj = game;
		table.state = "available";
		tableList.push(table);
	}
	return tableList;
};

module.exports = Utility;