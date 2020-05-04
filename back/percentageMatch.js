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
global.skillsArray = [];
global.jobSkillsArray = [];
var row = [];
var response = [];
global.result = '';


// Set this to the region you upload the Lambda function to.
AWS.config.region = 'us-east-1';

exports.handler = function(evt, context, callback) {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;

  pool.getConnection(function(err, connection) {

    //testing variables
    const userName = 'nlalta';
		var jobID;
    // const jobID = '4';
		//variables from request
		const request = JSON.parse(JSON.stringify(evt));
		//query to clear percentageMatch table
		var clearSQL = "TRUNCATE TABLE percentageMatch;";
		connection.query(clearSQL, function(error, results, fields) {
			//connection.release();
			if(error) context.succeed(error);
			else response += 'cleared table! ';
		});
		var savedJobID = [];
		var savedPercent = [];
		var time;


		numberOfJobs = request.length;

		for(let i = 0; i < numberOfJobs; i++) {
			jobID = request[i].jobID;
			savedJobID.push(jobID);

			var selectSQL = "SELECT * from job WHERE jobID=?;SELECT * FROM skills WHERE username=?; ";

			time = new Promise((success, failure) => {
				connection.query(selectSQL, [jobID, userName], function(error, result, fields) {
					if(error) failure(error);
					else {
						var skills = result[1];
						var job = result[0];
						Object.keys(skills).forEach(function(key) {
							row = skills[key];
							skillsArray.push(row.type);
						});
						Object.keys(job).forEach(function(key) {
							row = job[key];
							skillString = row.skills;
							jobSkillsArray = skillString.split(", ");
						});
						Array.prototype.diff = function(arr2) {
							var ret = [];
							this.sort();
							arr2.sort();
							for(var i = 0; i < this.length; i += 1) {
								if(arr2.indexOf(this[i]) > -1) {
									ret.push(this[i]);
								}
							}
							return ret;
						}
						var skillNeeded = jobSkillsArray.length;
						var skillMatch = jobSkillsArray.diff(skillsArray).length;

						results = (skillMatch / skillNeeded)*100;

						savedPercent.push(results);
						success(savedPercent);
					}
				});
			});
	}
	time.then(vals => {
		var insertSQL = "INSERT INTO percentageMatch(username, jobID, percentage) VALUES ?";

		var params;
		for(let j = 0; j < numberOfJobs; j++){
			var roundedPercent = Math.floor(savedPercent[j]);
			params = [
					[userName, savedJobID[j], roundedPercent]
				];
				connection.query(insertSQL, [params], function(error, results, fields) {
				});
		}
  });
});
};
