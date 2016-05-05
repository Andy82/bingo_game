var socket = require('socket.io');
var config = require('../config');
var Utility = require('../models/utility.js');
var Player = require('../models/player.js');
var Game = require('../models/game.js');
var Table = require('../models/table.js');
var Room = require('../models/room.js');


module.exports = function(server) {
   
var io = socket.listen(server, { log: false });
io.set('log level', 1); //Disable Log


var utility = new Utility();
var room = new Room("Test Room");
room.tables = utility.createSampleTables(config.get("tablesQuantity"));



// <Socket.IO Section>
io.sockets.on('connection', function (socket) {
  socket.emit('userOnline');
  socket.on('connectToServer',connectToServer);
  socket.on('connectToTable',connectToTable);  
  socket.on('userLeaveFromTable',userLeaveFromTable);
  socket.on('disconnect', disconnect);
  socket.on('numbersReceived', numbersReceived);
    
  //Only for testing stuff
  socket.on('dataIn', function(message){ 
    console.log("echo: " + message);
    socket.emit('echo', message);
  });
    
  function numbersReceived(data){  
    var player = room.getPlayer(socket.id);
    console.log("Player " + player.name + " sended card: " + data);
    player.card = data;
  };
    
  function connectToServer(data){  
    //Add player to the room
    var player = new Player(socket.id);
    player.setName(data.username);
    player.status = "available";
    room.addPlayer(player);
    //Send Other Players that new player has connected
    utility.sendEventToAllPlayersButPlayer('newUserOnline', {message:"Player is online",username:data.username},io,room.players,player);
    utility.sendEventToAllPlayers('tableList', {tableList: room.getTableMessage(),playerCount:room.players.length},io,room.players);
  };
  
  function connectToTable(data){
    var player = room.getPlayer(socket.id);
    var table = room.getTable(data.tableID);
    if(table.isTableAvailable() && table.addPlayer(player)){
      player.tableID = table.id;
      player.status = 'inTable';
      utility.sendEventToTable('userConnectedToTable',  {message:"Player is in Table"},io,table);
      utility.sendEventToAllPlayers('tableList', {tableList: room.getTableMessage(),playerCount:room.players.length},io,room.players);
      if(table.isPlaying()){
        //Now table starts playing
        utility.sendEventToTable('gameStarted', {tableList: room.getTableMessage()},io,table);
        table.gameObj.startGame(utility,io,table);
      }
    }
  };

  function userLeaveFromTable(data){
    //Check if the user is in table
    var player = room.getPlayer(socket.id);
    if(player.tableID != ""){
      var table = room.getTable(player.tableID);
      table.removePlayer(player);
      utility.sendEventToTable('userDisconnectedFromTable', {username:player.name},io,table);
      utility.sendEventToAllFreePlayersButPlayer('userDisconnectedFromTable',{username:player.name},io,room.players,player);
      socket.emit('playerDisconnectedFromTable', {username:player.name});
      utility.sendEventToAllPlayers('tableList', {tableList: room.getTableMessage(),playerCount: room.players.length},io,room.players);
    }
  };
    
  function disconnect(){
    //Check player status whether she is in table or game
    var player = room.getPlayer(socket.id);
    if (player === null) return;
    if(player.status != "available"){
      //Remove from table
      var table = room.getTable(player.tableID);
      table.removePlayer(player);
    }
    
    //Remove from room
    room.removePlayer(player);
    utility.sendEventToAllPlayersButPlayer('userDisconnectedFromGame',
      {message:"Player is disconnected",username:player.name},io,room.players,player);
    utility.sendEventToAllPlayers('tableList',
      {tableList: room.getTableMessage(),playerCount: room.players.length},io,room.players);
  };
});
     return io;
};