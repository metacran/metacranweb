var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');

function get_revdeps(package, callback) {

    try {
        cache('revdeps:' + package, callback, JSON.parse, function(key, cb) {
	    var url = urls.crandb + '/-/revdeps/' + package;
	    request(url, function(error, response, body) {
	        cb(error || response.statusCode != 200, body || '{}');
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

module.exports = get_revdeps;
