r = require('mersenne');
var config = require('../config');
var log = require('../lib/log')(module);
Stopwatch = require('./stopwatch.js');

function Game(){
	this.numCount = config.get("maxNumbers");
	this.numMaxValue = 9;
	this.numArray = [];
	this.bBingoArray = [];
};

Game.prototype.generateNumbers = function() {
	var numbersCount = this.numCount;
	for (var i =0; i< numbersCount; i++)
	{
		var number = r.rand(this.numMaxValue) + 1 ;
		this.numArray.push(number);
	}
	
	log.info(this.numArray.toString());
};

Game.prototype.startGame = function(utility,io,table) {
    var stopwatch = new Stopwatch();
    var gameObject = this;
	
	stopwatch.start();
    stopwatch.on('tick', tick);
	stopwatch.on('end', end);
	
	
	function tick(time) {
      utility.sendEventToTableInPlay('timerTick',{time: time},io,table);
    };	
		
	function end(time) {
		var chosenNumber = gameObject.generateNumbers();
		
		utility.sendEventToTableInPlay('timerEnd',{time: time},io,table);
		utility.sendEventToTableInPlay('showResults',{numArray: gameObject.numArray},io,table);
		utility.sendEventToTableInPlay('gameFinished',{message:"Game is finished"},io,table);
	  
      	var bingoWinners = gameObject.checkAnyPlayerWins(table);
			if(bingoWinners.length > 0)
				utility.sendEventToSelectedPlayers('bingoWinner',{message:"You are the BINGO winner!"},io,bingoWinners);
    };

};


Game.prototype.checkAnyPlayerWins = function(table) {
	var winnersList = [];
	for(var i = 0; i < table.players.length; i++){
		if(this.isPlayerWins(table.players[i])){
			log.info("Winner");
			winnersList.push(table.players[i]);
		}
	}
	return winnersList;
};

Game.prototype.isPlayerWins = function (player) {
	var count = this.numCount;
	
	log.info("Player card: " + player.card);
	
	for (var i = 0; i< count; i++){
		if (player.card[i] == this.numArray[i]) 
		{
			this.bBingoArray.push(true);
		} 
	}
	log.info(this.bBingoArray.toString());
	return this.bBingoArray.length == count;
};

module.exports = Game;