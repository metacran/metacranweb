var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');
var clean_deps = require('../lib/clean_deps');

function cleanup(pkg) {
    return clean_deps(clean_package(JSON.parse(pkg)));
}

function get_package(package, callback) {

    cache('package:' + package, callback, cleanup, function(key, cb) {
	var url = urls.crandb + '/' + package;
	request(url, function(error, response, body) {
	    cb(error || response.statusCode != 200, body);
	});
    });
}

module.exports = get_package;
