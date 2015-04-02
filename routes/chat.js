
var	chat	= SocketIO.of( '/chat' );

chat.on( 'connection', function(socket)
{
	socket.emit('toclient',{msg:'Welcome chat!'});
	socket.on( "fromclient", function(data)
	{
		socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
		socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
		console.log('Message from client :'+data.msg);
	});
});

