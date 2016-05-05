var express = require('express');

//Testing Stopwatch
/*Stopwatch = require('./models/stopwatch.js');
var stopwatch = new Stopwatch();
stopwatch.start();
stopwatch.on('tick', function(time) { console.log(time);});
*/
//Testing Stopwatch

//Testing Number Generation

Game =  require('./models/game.js');
Player =  require('./models/player.js');
Table = require('./models/table.js');
Room = require('./models/room.js');

var player = new Player(1);
player.setName("Player1");
player.status = "available";
player.card = [1, 2, 3, 4, 5];

var room = new Room("Test Room");
var table = new Table();
table.players.push(player);
room.tables = table;


var game = new Game();
game.generateNumbers();
game.checkAnyPlayerWins(room.tables);