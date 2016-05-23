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
		$('h4').toggle(2000);
	});

	$("input[type=text]").focus(function () {
		$(this).animate({
			width: "10%",
			fontSize: "3em"
		}, 100);
	});
	$(this).focusout(function () {
		$("input[type=text]").animate({
			width: "5%",
			fontSize: "1em"
		}, 100);
	});

	  $("input[type=text]").keypress(function (e) {
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $("#timerSpan").html("Digits Only").show().fadeOut("slow");
        return false;
    }
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
		$("#timerSpan").text("Game Over").css({fontSize: '1em', opacity: '0.1'});
		$("#timerSpan").animate({fontSize: '2em', opacity: '1'}, "slow");
	});

	socket.on('showResults',function(data){
		$("#chosenNumberSpan").text(data.numArray);
	});


	socket.on('numberChosen',function(data){
		console.log(data);
		$("#chosenNumberSpan").text(data.chosenNumber);
	});


	socket.on('gameFinished',function(data){
		$("#gameFinishedSpan").text("Game is Finished").css({fontSize: '1em', opacity: '0.1'});
		$("#gameFinishedSpan").animate({fontSize: '2em', opacity: '1'}, "slow");
	});


	socket.on('bingoWinner',function(data){
		$("#gameFinishedSpan").text("You are the Bingo Winner");
		$("#gameFinishedSpan").animate({fontSize: '3em', opacity: '1'}, "slow");
	});

})();
