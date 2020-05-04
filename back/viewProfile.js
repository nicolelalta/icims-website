const AWS = require('aws-sdk');
const querystring = require('querystring');
var mysql = require('mysql');

//connecting to DB
var pool = mysql.createPool({
  host: "icimsproject.c4hdae2hey0k.us-east-1.rds.amazonaws.com",
  user: "nicole",
  password: "Class3027",
  database: "ndl27",
  multipleStatements: true
});
// var accountArray = {};
// var skillsArray = [];
// var schoolArray = [];
// const firstName = '';
// const lastName = '';
// const username = '';
// const email = '';
AWS.config.region = 'us-east-1';

exports.handler = function(evt, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  pool.getConnection(function(err, connection) {
    //testing
    const username = 'nlalta';
    var selectSQL = "SELECT firstName, lastName, email,username FROM login WHERE username='nlalta'; SELECT type FROM skills WHERE username='nlalta'; SELECT school FROM education WHERE username='nlalta'; ";

    //selecting from DB
    connection.query(selectSQL, function(error, results, fields) {
      connection.release();
      if(error) context.succeed(error);
      else {
        var account = results[0];
        var skills = results[1];
        var education = results[2];
        var skillsArray = [];
        var schoolArray = [];
        var accountArray = {};
        Object.keys(skills).forEach(function(key) {
          row = skills[key];
          skillsArray.push(row.type);
        });
        skills = skillsArray.toString();
        Object.keys(education).forEach(function(key) {
          row = education[key];
          schoolArray.push(row.school);
        });
        education = schoolArray.toString();
        Object.keys(account).forEach(function(key) {
          row = account[key];
          accountArray = {
            firstName: row.firstName,
            lastName: row.lastName,
            username: row.username,
            email: row.email,
          };
        });
        accountArray["type"] = skills;
        accountArray["school"] = education;
        // var skill = {
        //   type: skills
        // };
        // var educationTable = {
        //   school: education
        // };

        var response = [
          accountArray
        ];
        context.succeed(response);
      }

    });
  });
};
