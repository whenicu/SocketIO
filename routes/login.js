

var	login	= SocketIO.of( '/login' );

login.on( 'connection', function(socket)
{
	socket.emit('toclient',{msg:'Welcome login!'});
	//	login.insert
	socket.on( "fromclient", function(data)
	{
		var	sql		= "call Account_Select(?)";
		MySQL.Query( sql, [data.name], function(err,rows)
		{
			var	result	= JSON.stringify(rows);
			console.log( 'The solution is: ', result );
			socket.emit( "toclient", {msg:result} );
		});
	});

	//	login.delete
	socket.on( "delete", function(data)
	{
		console.log( "login cmd : " + data );
		socket.emit( "login : " + data );
	});

	//	login.select
	socket.on( "select", function(data)
	{
		console.log( "login cmd : " + data );
		socket.emit( "login : " + data );
	});
});

