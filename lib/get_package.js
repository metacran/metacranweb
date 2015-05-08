var request = require('request');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');
var clean_deps = require('../lib/clean_deps');
var handle_error = require('../lib/handle_error');

function get_package(package, res, callback) {
    var url = urls.crandb + '/' + package;
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	callback(clean_deps(clean_package(JSON.parse(body))));
    });
}

module.exports = get_package;
