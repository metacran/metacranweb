var request = require('request');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');
var clean_deps = require('../lib/clean_deps');

function get_package(package, callback) {
    var url = urls.crandb + '/' + package;
    request(url, function(error, response, body) {
	callback(error, error ||
		 clean_deps(clean_package(JSON.parse(body))));
    });
}

module.exports = get_package;
