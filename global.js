
var	fs			= require( 'fs' );

global.Config	= JSON.parse( fs.readFileSync( "./config.json" ) );
global.MySQL		= require( './util/MySQL' );
global.SocketIO	= null;

