const AWS = require('aws-sdk');
const querystring = require('querystring');
var mysql = require('mysql');

//connecting to db
var pool = mysql.createPool({
	host: "icimsproject.c4hdae2hey0k.us-east-1.rds.amazonaws.com",
	user: "nicole",
	password: "Class3027",
	database: "ndl27"
});

// Set this to the region you upload the Lambda function to.
AWS.config.region = 'us-east-1';

exports.handler = function(evt, context, callback) {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
	//context.succeed({location: '/'});


  pool.getConnection(function(err, connection) {
    //parsing raw request body
    const formData = querystring.parse(evt.body);
    //separating form data
    const fName = formData['firstName'];
    const lName = formData['lastName'];
    const username = formData['userName'];
    const password = formData['password'];
    const email = formData['email'];

    var insertSQL = "INSERT INTO login(firstName, lastName, username, password, email) VALUES ?";

    var values = [
      [fName, lName, username, password, email]
    ];

 //insert form data into DB
    connection.query(insertSQL, [values], function(error, results, fields) {
      connection.release();
      if(error) callback(error);
      else context.succeed({location: 'http://localhost:3000/'});
    });

	});
};
