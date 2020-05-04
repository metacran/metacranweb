var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');

function cleanup(x) { return JSON.parse(x).task_views; }

function get_pkg_tvs(package, callback) {

    try {
        cache('pkgtv:' + package, callback, cleanup, function(key, cb) {
	    var url = urls.docsdb + '/task-view-pkgs/' + package;
	    request(url, function(error, response, body) {
	        if (error || response.statusCode != 200) {
		    cb(null, '{}');
	        } else {
		    cb(null, body);
	        }
	    });
        })
    } catch(err) {
        return callback(err);
    }
}

module.exports = get_pkg_tvs;
