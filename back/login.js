const AWS = require('aws-sdk');
const querystring = require('querystring');
var mysql = require('mysql');
var bodyParser = require('body-parser');
'use strict';

//connecting to db
var pool = mysql.createPool({
	host: "",
	user: "",
	password: "",
	database: "",
	multipleStatements: true
});

// Set this to the region you upload the Lambda function to.
AWS.config.region = 'us-east-1';

exports.handler = function(evt, context, callback) {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;

  pool.getConnection(function(err, connection) {


		const request = querystring.parse(evt.body);


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
				const response = {location: ''};
				context.succeed(response);
			}
		});
  });
};
