var socket = require('socket.io');
var log = require('../lib/log')(module);
var config = require('../config');
var connect = require('connect'); // npm i connect
var cookie = require('cookie');  
var cookieParser = require('cookie-parser');
var async = require('async');
var sharedsession = require('express-socket.io-session');
var Utility = require('../models/utility.js');
var User = require('../models/user').User;
var Player = require('../models/player.js');
var Game = require('../models/game.js');
var Table = require('../models/table.js');
var Room = require('../models/room.js');

var HttpError = require('error').HttpError;

module.exports = function(server, session) {

var io = socket.listen(server, { log: false });
io.use(sharedsession(session));

var utility = new Utility();
var room = new Room("Test Room");
room.tables = utility.createSampleTables(config.get("tablesQuantity"));



// <Socket.IO Section>
io.sockets.on('connection', function (socket) {
  socket.emit('userOnline');
  socket.on('connectToServer',connectToServer);
  socket.on('connectToRoom',connectToRoom);
  socket.on('connectToTable',connectToTable);  
  socket.on('userLeaveFromTable',userLeaveFromTable);
  socket.on('disconnect', disconnect);
  socket.on('numbersReceived', numbersReceived);
  socket.on('pageLoaded', pageLoaded);
  
  
  //Only for testing stuff
  socket.on('dataIn', function(message){ 
    console.log("echo: " + message);
    socket.emit('echo', message);
  });

  function pageLoaded(data){  
      socket.emit('showUsersOnline', {playerCount:room.players.length});
  }

  function numbersReceived(data){  
    var player = room.getPlayer(socket.handshake.session.user);
    
    if (player.card !== data)
    {
      console.log("Player " + player.name + " sended card: " + data);
      player.card = data;
      socket.emit('echo', "Server received cards: " + data + " from user " + player.name);
    }
    
      socket.emit('blockFields', player.card);
  }
    
  function connectToServer(){  
    var sessionId = socket.handshake.session.user;
    var player = room.getPlayer(sessionId)
    
    if (!player && sessionId !== undefined) {
        player = new Player(sessionId);
        player.setName(socket.handshake.session.currentUser.name);
        player.status = "available";
        room.addPlayer(player);
    }
    socket.emit('showUsersOnline', {playerCount:room.players.length});
  }
  
  
  
  function connectToRoom(data){  
      var sessionId = socket.handshake.session.user;
      var player = room.getPlayer(sessionId)
      drawTable();
  } 
  
  
  function connectToTable(data){
    var player = room.getPlayer(socket.handshake.session.user);
    var table = room.getTable(data.tableID);
    if(table.isTableAvailable() && table.addPlayer(player)){
      player.tableID = table.id;
      player.status = 'inTable';
      drawTable();
      if(table.isPlaying()){
        //Now table starts playing
        socket.emit('gameStarted', {tableList: room.getTableMessage()});
        table.gameObj.startGame(utility,io,table);
      }
    }
  }


  function userLeaveFromTable(data){
    //Check if the user is in table
    var player = room.getPlayer(socket.handshake.session.user);
    if(player  !== undefined && player.tableID != ""){
      var table = room.getTable(player.tableID);
      table.removePlayer(player);
      socket.emit('userDisconnectedFromTable', {username:player.name});
      socket.emit('userDisconnectedFromTable',{username:player.name});
      socket.emit('playerDisconnectedFromTable', {username:player.name});
      drawTable();
    }
  }


  function disconnect(){
    var player = room.getPlayer(socket.handshake.session.user);
    if (player === null) return;
    if(player.status != "available"){
      var table = room.getTable(player.tableID);
      table.removePlayer(player);
    }
    room.removePlayer(player);

    drawTable();
  }
  
  
  
  function drawTable(){
      var tables = room.getTableMessage();
        socket.emit('tableList', {tableList: tables});
  }
  
  
  
  
});
     return io;
};