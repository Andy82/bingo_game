var expect  = require("chai").expect;
var request = require("request");
var assert = require('chai').assert;

/* npm test */

describe("Bingo game", function() {

  describe("Check screens", function() {
    it("Root", function(done) {
      request("http://localhost:3000/", function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it("Table", function(done) {
      request("http://localhost:3000/table", function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });   
    
    it("Room", function(done) {
      request("http://localhost:3000/room", function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });    
    
    it("Login", function(done) {
      request("http://localhost:3000/login", function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });   
  });
  
  describe("Check Game Logic", function() {
    it("Check creating of Players", function(done) {
        Player =  require('../models/player.js');
        var player = new Player(1);
        player.setName("Player1");
        expect(player.name).to.equal("Player1");
        done();
        });
        
    it("Check creating of Player Cards", function(done) {
        Player =  require('../models/player.js');
        var player = new Player(1);
        player.setName("Player1");
        player.card = [1, 2, 3, 4, 5];
        expect(player.card).to.be.an('array');
        done();
        });
        
    it("Check number generator", function(done) {
        Game =  require('../models/game.js');
        var game = new Game();
        game.generateNumbers();
        expect(game.numArray).to.be.an('array');
        done();
        });
        
    it("Check creating of tables", function(done) {
        Player =  require('../models/player.js');
        Table = require('../models/table.js');

        var player = new Player(1);
        player.setName("Player1");
        player.status = "available";
        player.card = [1, 2, 3, 4, 5];

        var table = new Table();
        table.players.push(player);
        
        expect(table.players).to.be.an('array');
        done();
        });
     it("Check Player Wins", function(done) {
        Game =  require('../models/game.js');
        Player =  require('../models/player.js');
        Table = require('../models/table.js');
        Room = require('../models/room.js');

        var player = new Player(1);
        player.setName("Player1");
        player.status = "available";

        var room = new Room("Test Room");
        var table = new Table();
        table.players.push(player);
        room.tables = table;

        var game = new Game();
        game.generateNumbers();
        player.card = game.numArray;
        game.checkAnyPlayerWins(room.tables);
        
        expect(game.bBingoArray).to.be.an('array');
        done();
        });
  });

});