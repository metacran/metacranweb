var request = require('request');
var urls = require('../lib/urls');
var comma = require('comma-numbers')();

function num_downloads(callback) {

    var url = urls.cranlogs + '/downloads/total/last-week';
    request(url, function(error, response, body) {
	if (error) { return callback(error, undefined); }
	callback(error, comma(JSON.parse(body)[0].downloads));
    });
}

module.exports = num_downloads;
