$(document).ready(function(){
var socket = io.connect();

	$(".backToRoomPage").click(function(){
		socket.emit('userLeaveFromTable',{});
		isCardShown = false;
		$("#gameFinishedSpan").text("");
	});

	socket.on('userOnline', function (data) {
		socket.emit('connectToServer', { username : 'AAAAAA' });
	});

	socket.on('showUsersOnline',function(data){
		$("#onlineUserCount").empty();
		$("#onlineUserCount").text("-- " + data.playerCount + " Online Users --");
	});
});