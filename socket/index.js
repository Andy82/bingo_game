var socket = require('socket.io');
var config = require('../config');
var log = require('../lib/log')(module);
var async = require('async');
var cookie = require('cookie');  
var connect = require('connect'); // npm i connect
var sessionStore = require('lib/sessionStore');
var Utility = require('../models/utility.js');
var User = require('../models/user').User;
var Player = require('../models/player.js');
var Game = require('../models/game.js');
var Table = require('../models/table.js');
var Room = require('../models/room.js');

var HttpError = require('error').HttpError;

module.exports = function(server) {
   
var io = socket.listen(server, { log: false });
io.set('log level', 1); //Disable Log
io.set('origins', 'localhost:*');
io.set('logger', log);

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
    
  //TODO: Add user name to events on connection and disconnect
  var username = socket.handshake.user.get('username');
  socket.broadcast.emit('join', username);  
    
  
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



io.set('authorization', function(handshake, callback) {
    async.waterfall([
      function(callback) {
        // сделать handshakeData.cookies - объектом с cookie
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        var sidCookie = handshake.cookies[config.get('session:key')];
        var sid = connect.utils.parseSignedCookie(sidCookie, config.get('session:secret'));
        
        //var cookieParser = require('cookie-parser');

      //var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));


        loadSession(sid, callback);
      },
      
      function(session, callback) {

        if (!session) {
          callback(new HttpError(401, "No session"));
        }

        handshake.session = session;
        loadUser(session, callback);
      },
      
      function(user, callback) {
        if (!user) {
          callback(new HttpError(403, "Anonymous session may not connect"));
        }

        handshake.user = user;
        callback(null);
      }

    ], function(err) {
      if (!err) {
        return callback(null, true);
      }

      if (err instanceof HttpError) {
        return callback(null, false);
      }

      callback(err);
    });

  });


io.sockets.on('sessreload', function(sid) {
var clients = io.sockets.clients();

for (var i=1; i< clients.length; i++) {
   var client = clients[i];
 // clients.forEach(function(client) { //issue on https://github.com/karma-runner/karma/issues/1782
      if (client.handshake.session.id != sid) return;

      loadSession(sid, function(err, session) {
        if (err) {
          client.emit("error", "server error");
          client.disconnect();
          return;
        }

        if (!session) {
          client.emit("logout");
          client.disconnect();
          return;
        }

        client.handshake.session = session;
      });
    }
});


function loadSession(sid, callback) {
  // sessionStore callback is not quite async-style!
  sessionStore.load(sid, function(err, session) {
    if (arguments.length == 0) {
      // no arguments => no session
      return callback(null, null);
    } else {
      return callback(null, session);
    }
  });
}

function loadUser(session, callback) {
  if (!session.user) {
    log.debug("Session %s is anonymous", session.id);
    return callback(null, null);
  }
  log.debug("Retrieving user ", session.user);
  User.findById(session.user, function(err, user) {
    if (err) return callback(err);
    if (!user) {
      return callback(null, null);
    }
    log.debug("user findbyId result: " + user);
    callback(null, user);
  });
}


     return io;
};