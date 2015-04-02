
var	express		= require( 'express' );
var	http		= require( 'http' );
var	bodyParser	= require( 'body-parser' );
var	global		= require( './global' );

var	app			= express();
var	server		= http.createServer(app);

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( function(req, res, next)) {
	var	err		= new Error( 'catch 404 and forward to error handler');
	err.status	= 404;
	next( err);
});

http.globalAgent.maxSockets	= Infinity;


process.on( 'uncaughtException', function(err){
	console.log( 'uncaughtException: ' + err);
});

//	 파라미터로 포트값을 주면, 기존 환경설정의 포트값을 대체한다.
var	listenPort	= Config.port;
if( process.argv.length > 2 )
{
	listenPort	= process.argv[2];
}

if( !module.parent )
{
	server.listen( listenPort, function(){
		console.log( "Express Server pid [%d] listening on port [%d]", process.pid, listenPort );
	});

	SocketIO	= require( 'socket.io' ).listen( server );
	require( './routes/index');
//	require( './routes/chat' );
//	require( './routes/login' );
}
else
{
	module.exports = server;
	console.log( "Server pid [%d]", process.pid );
}

