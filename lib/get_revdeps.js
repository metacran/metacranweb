var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');

function get_revdeps(package, callback) {

    cache('revdeps:' + package, callback, JSON.parse, function(key, cb) {
	var url = urls.crandb + '/-/revdeps/' + package;
	request(url, function(error, response, body) {
	    cb(error || response.statusCode != 200, body);
	});
    });
}

module.exports = get_revdeps;
