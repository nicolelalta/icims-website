const AWS = require('aws-sdk');
const querystring = require('querystring');
var mysql = require('mysql');
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

  pool.getConnection(function(err, connection) {

		var selectSQL = "SELECT job.jobID, job.title, job.description, job.salary, job.location, job.yearsexp, job.skills, job.turnover, job.worklife, percentageMatch.percentage FROM job JOIN percentageMatch ON job.jobID = percentageMatch.jobID;";

		connection.query(selectSQL, function(error, result, fields) {
			connection.release();
			if(error) context.succeed(error);
			else context.succeed(result);
		});



  });

};
