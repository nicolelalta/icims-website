const AWS = require('aws-sdk');
const querystring = require('querystring');
var mysql = require('mysql');
var bodyParser = require('body-parser');
'use strict';

//connecting to db
var pool = mysql.createPool({
	host: "icimsproject.c4hdae2hey0k.us-east-1.rds.amazonaws.com",
	user: "nicole",
	password: "Class3027",
	database: "ndl27",
	multipleStatements: true
});

// Set this to the region you upload the Lambda function to.
AWS.config.region = 'us-east-1';

exports.handler = function(evt, context, callback) {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
/*
	let responseBody = {
		message: "hello",
		key1: JSON.parse(JSON.stringify(evt))
	};
	const response = {
		statusCode: 200,
		headers: {"Access-Control-Allow-Origin": "*"},
		body: JSON.stringify(responseBody)
	};
	context.succeed(response);
*/

  pool.getConnection(function(err, connection) {
    //parsing raw request body


		const request = querystring.parse(evt.body);

/*		const response = {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			},
			body: request
		};

		context.succeed(response);
*/
		const userName = request.userName;
		const password = request.password;

    var insertSQL = "SELECT firstName, lastName FROM login WHERE username=? AND password=?; ";
		//insertSQL += "SELECT firstName, lastName FROM login WHERE password=?;";

		//callback(null, values);
		connection.query(insertSQL, [userName, password], function(error, results) {
			connection.release();
			if(results.length == 0) {
				const message = 'Login is incorrect';
				context.succeed(message);
			}
			if(results.length != 0) {
				const response = {location: 'https://491final.s3.amazonaws.com/ViewJobsLargerNavBar.html'
				};
				context.succeed(response);
			}
		});
  });
/*
    // Our field from the request.
    const my_field = params['my-field'];

    // Generate HTML.
    const html = `<!DOCTYPE html><p>You said: ` + my_field + `</p>`;

    // Return HTML as the result.
    callback(null, html);

		**for loop used in order to take out firstName and lastName from results array**
		for(const [key, value] of results) {
			callback(null, `<!DOCTYPE html><p>` + JSON.stringify(key.firstName) + `: `+ JSON.stringify(key.lastName) + `<br> `+ JSON.stringify(value) + `</p></html>`);
		}

*/
};
