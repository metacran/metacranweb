var request = require('request');
var urls = require('../lib/urls');
var comma = require('comma-numbers')();

function num_maint(callback) {

    var url = urls.crandb + '/-/nummaint';
    request(url, function(error, response, body) {
	if (error) { return callback(error, undefined); }
	console.log(JSON.parse(body))
	callback(error, comma(JSON.parse(body).count));
    });
}

module.exports = num_maint;
