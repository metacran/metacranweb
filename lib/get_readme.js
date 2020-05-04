var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');

function cleanup(x) { return JSON.parse(x).html; }

function get_readme(package, callback) {

    try {
        cache('readme:' + package, callback, cleanup, function(key, cb) {
	    var url = urls.docsdb + '/readme/' + package;
	    request(url, function(error, response, body) {
	        if (error || response.statusCode != 200) {
		    cb(error, '{}');
	        } else {
		    cb(null, body);
	        }
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

module.exports = get_readme;
