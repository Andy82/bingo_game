$(document).ready(function(){
var socket = io.connect();
	
	
	//socket.emit('userLeaveFromTable');
	
	socket.on('userOnline', function (data) {
		socket.emit('connectToServer', { username : 'AAAAAA' });
	});

	socket.on('showUsersOnline',function(data){
		$("#onlineUserCount").empty();
		$("#onlineUserCount").text("-- " + data.playerCount + " Online Users --");
	});
});