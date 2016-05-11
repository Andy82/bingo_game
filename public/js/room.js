$(document).ready(function(){
var socket = io.connect();

	socket.on('tableList',function(data){
		var html = "";
		for(var i = 0; i < data.tableList.length; i++){
			html += "<li><a href='/table' class='showGamePage' data-id='"+ data.tableList[i].id +"'>"+ data.tableList[i].name +" &nbsp;&nbsp;&nbsp;&nbsp;"
				+ data.tableList[i].players.length +"/"+ data.tableList[i].playerLimit +"</a></li>"
		}
		$('#roomList').empty();
		$('#roomList').append(html);
		$('#roomList').listview('refresh');

		$('.showGamePage').click(function(){
			var selectedTableId = $(this).attr('data-id');
			socket.emit('connectToTable', {tableID: selectedTableId});
		});
	});
});