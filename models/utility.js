Game = require('./game.js');
Table = require('./table.js');
var uuid = require('node-uuid');

function Utility() { };

Utility.prototype.sendEventToTableInPlay = function (event, message, io, table) {
	for (var i = 0; i < table.players.length; i++) {
		message.userId = table.players[i].id;
		message.userCard = table.players[i].card;
		message.userCardInStraight = table.players[i].cardInStraight;
		io.sockets.emit(event, message);
	};
};

Utility.prototype.sendEventToSpecificPlayer = function(event,message,io,player) {
	io.sockets.emit(event, message);
	//io.to(socket.id).emit("event", data);
};

Utility.prototype.createSampleTables = function (tableListSize) {
	var tableList = [];
	for (var i = 0; i < tableListSize; i++) {
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