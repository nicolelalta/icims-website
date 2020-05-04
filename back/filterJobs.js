const AWS = require('aws-sdk');
const querystring = require('querystring');
var mysql = require('mysql');

//connecting to DB
var pool = mysql.createPool({
  host: "icimsproject.c4hdae2hey0k.us-east-1.rds.amazonaws.com",
  user: "nicole",
  password: "Class3027",
  database: "ndl27"
});

AWS.config.region = 'us-east-1';

exports.handler = function(evt, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  pool.getConnection(function(err, connection) {
    //request from front
    const request = querystring.parse(evt.body);

    const keyword = '%' + request.keyword + '%';
    const location = request.location;

    if(keyword.length != 0 && location.length === 0){
      var selectSQL = "SELECT * FROM job WHERE title LIKE ?";
      var values = [
        keyword
      ];
    }
    else if(keyword.length === 0 && location.length != 0) {
      var selectSQL = "SELECT * FROM job WHERE location=?";
      var values = [
        location
      ];
    }
    else if(keyword.length != 0 && location.length != 0) {
      var selectSQL = "SELECT * FROM job WHERE title LIKE ? AND location=?";
      var values = [
        keyword, location
      ];
    }

   //selecting from DB
    connection.query(selectSQL, values , function(error, results, fields) {
      connection.release();
      if(error) context.succeed(error);
      if(results.length == 0) {
        const message = 'Job not found';
        context.succeed(message);
      }
      else {
        var response =
          '<html><head><link rel="stylesheet" type="text/css" src="ViewJobs.css"></head><body><table><th>ID</th><th>JOB TITLE</th><th>SALARY</th><th>DESCRIPTION</th><th>LOCATION</th><th>YEARS OF EXPERIENCE</th><th>SKILLS REQUIRED</th><th>SELECT JOB</th>';
        Object.keys(results).forEach(function(key) {
          var row = results[key];
          response += '<tr><td>' + row.jobID + '</td><td>';
          response += row.title + '</td><td>';
          response += row.salary + '</td><td>';
          response += row.description + '</td><td>';
          response += row.location + '</td><td>';
          response += row.yearsexp + '</td><td>';
          response += row.skills + '</td><td>';
          response += '<input type="checkbox" name="check[]" id="Checkbox"></checkbox></tr></table></body</html>';
        });
        context.succeed(response);
      }
    });

  });
};
