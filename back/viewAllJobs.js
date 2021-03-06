const AWS = require('aws-sdk');
const querystring = require('querystring');
var mysql = require('mysql');

//connecting to db
var pool = mysql.createPool({
	host: "",
	user: "",
	password: "",
	database: ""
});

// Set this to the region you upload the Lambda function to.
AWS.config.region = 'us-east-1';

exports.handler = function(evt, context, callback) {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;

  pool.getConnection(function(err, connection) {
    //parsing raw request body
    //const formData = querystring.parse(evt.body);


    var selectSQL = "SELECT * FROM job; ";


   //select form data into DB
    connection.query(selectSQL, function(error, results, fields) {
      connection.release();
      if(error) callback(error);
      else context.succeed(results);
    });
  });
};
