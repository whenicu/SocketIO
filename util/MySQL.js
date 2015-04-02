
var	async		= require( 'async' );
var	mysql		= require( 'mysql' );
var	pool		= mysql.createPool( Config.dbConnSettings );

function Split( items )
{
	if( !items )
		return null;

	if( items.length === 0 )
		return null;

	var	result	= [];
	async.each( items, function( e, endCallback )
	{
		if( e['fieldCount'] != undefined || e['affectedRow'] != undefined )
			return;

		if( Array.isArray( e ) && e.length == 1 )
			result.push( e[0] );
		else
			result.push( e );

		//return endCallback(null);
	}, null );

	return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Query No Transaction
exports.Query = function( sqlstring, args, endCallback )
{
	pool.getConnection( function(err,connection)
	{
		if(err)
		{
			console.error( err );
			connection.release();
			return;
		}

		connection.query( sqlstring, args, function(err,rows)
		{
			if(err)
			{
				console.error( err );
				connection.release();
			}
			else
			{
				rows	= Split(rows);
				endCallback(err,rows);
				connection.release();
			}
		});
	});
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Query Transaction
exports.QueryTransaction = function( sqlstring, args, endCallback )
{
	pool.getConnection( function(err,connection)
	{
		if(err)
		{
			console.error( err );
			connection.release();
			return;
		}
		connection.beginTransaction( function(err)
		{
			if(err)
			{
				console.error( err );
				connection.release();
				return;
			}
			connection.query( sqlstring, args, function(err,rows)
			{
				if(err)
				{
					console.error( err );
					connection.rollback( null );
					connection.release();
				}
				else
				{
					connection.commit( function(err)
					{
						if(err)
						{
							console.error( err );
							connection.rollback( null );
							connection.release();
						}
						else
						{
							rows	= Split(rows);
							endCallback( err, rows );
							connection.release();
						}
					});	// commit
				}	// else

			});	// query
		});		// transaction

	});
}

