Game = require('./game.js');
var config = require('../config');

function Table(tableID){
	this.id = tableID;
	this.name = "";
	this.status = "available";
	this.players = [];
	this.playerLimit = config.get("playerLimit");
	this.gameObj = null;
};

Table.prototype.setName = function(name){
	this.name = name;
};

Table.prototype.getName = function(){
	return this.name;
};

Table.prototype.setStatus = function(status){
	this.status = status;
};

Table.prototype.isAvailable = function(){
	return this.status === "available";
};

Table.prototype.isFull = function(){
	return this.status === "full";
};

Table.prototype.isPlaying = function(){
	return this.status === "playing";
};

Table.prototype.addPlayer = function(player) {
	//Check table state
	if(this.state == "available"){
		//Check this player is in table or not
		var found = false;
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i].id == player.id){
				found = true;
				break;
			}
		}
		if(!found){
			this.players.push(player);
			if(this.players.length == config.get("playerLimit")){
				this.status = "playing";
				
				//Change status of the each player
				this.gameObj = new Game();
				for(var i = 0; i < this.players.length; i++){
					this.players[i].status = "playing";
				}
			}
			return true;
		}
	}
	return false;
};

Table.prototype.removePlayer = function(player){
	var index = -1;
	for(var  i = 0; i < this.players.length; i++){
		if(this.players[i].id === player.id){
			index = i;
			break;
		}
	}
	if(index != -1){
		this.players.remove(index);
	}
};

Table.prototype.isTableAvailable = function() {
	return (this.playerLimit > this.players.length);
};

Table.prototype.createMessageObject = function() {
	var table = this;
	var TableMessage = function(){
		this.id = table.id;
		this.name = table.name;
		this.status = table.status;
		this.players = table.players;
		this.playerLimit = table.playerLimit;
	};

	return new TableMessage();
};

module.exports = Table;