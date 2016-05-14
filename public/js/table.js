//$(document).ready(function(data){
(function(){
	
var socket = io.connect();
	socket.emit('pageLoaded', 'table');

 	$(document.forms['table-form']).on('submit', function(){
		//socket.emit('dataIn', $('#m1').val());
		var values = [];
		values.push($('#m1').val());
		values.push($('#m2').val());
		values.push($('#m3').val());
		values.push($('#m4').val());
		values.push($('#m5').val());
		
		socket.emit('numbersReceived', values);
		console.log(values);
		//$('#m').val(''); 			//Clear field
		return false;
	});

	$(".backToRoomPage").click(function(){
		socket.emit('userLeaveFromTable',{});
		$("#gameFinishedSpan").text("");
	});

	socket.on('blockFields', function(data){
		$('#m1').prop('disabled', true).val(data[0]);
		$('#m2').prop('disabled', true).val(data[1]);
		$('#m3').prop('disabled', true).val(data[2]);
		$('#m4').prop('disabled', true).val(data[3]);
		$('#m5').prop('disabled', true).val(data[4]);
		$('#send').prop('disabled', true);
	});


	socket.on('echo', function(msg){
		$('#messages').append($('<li>').text(msg));
	});

	socket.on('gameStarted',function(data){
		console.log("A new game is started");
	});

	socket.on('timerTick',function(data){
		$("#timerSpan").text(data.time);
	});

	socket.on('timerEnd',function(data){
		$("#timerSpan").text("Game Over");
	});

	socket.on('showResults',function(data){
		$("#chosenNumberSpan").text(data.numArray);
	});


	socket.on('numberChosen',function(data){
		console.log(data);
		$("#chosenNumberSpan").text(data.chosenNumber);
	});


	socket.on('gameFinished',function(data){
		$("#gameFinishedSpan").text("Game is Finished");
	});


	socket.on('bingoWinner',function(data){
		$("#gameFinishedSpan").text("You are the Bingo Winner");
	});

})();
