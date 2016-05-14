$( window ).load(function(){
	var socket = io.connect();
	
	socket.on('userOnline', function (data) {
		socket.emit('connectToServer');
	});

	socket.on('showUsersOnline',function(data){
		$("#onlineUserCount").empty();
		$("#onlineUserCount").text("-- " + data.playerCount + " Online Users --");
	});
});