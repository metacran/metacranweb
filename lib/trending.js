var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

function trending(callback) {

    try {
        cache('index:trending', callback, JSON.parse, function(key, cb) {
	    var url = urls.cranlogs + '/trending';
	    request(url, function(error, response, body) {
	        if (error) { return cb(error); }
                try {
	            var pbody = JSON.parse(body).slice(0, 10);
	            var pkgs = pbody.map(function(x) { return '"' + x.package + '"'; });

	            var url = urls.crandb + '/-/versions?keys=[' + pkgs.join(',') + ']';
	            request(url, function(error, response, body) {
		        if (error) { return cb(error); }
                        try {
		            var pkgs = JSON.parse(body);
		            var keys = Object.keys(pkgs);
		            var pkg_array = [];
		            for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
		            cb(null, JSON.stringify(pkg_array.map(clean_package)));
                        } catch(err) {
                            return cb(err);
                        }
	            });
                } catch(err) {
                    return cb(err);
                }
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

module.exports = trending;
