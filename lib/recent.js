var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

function recent(callback) {

    try {
        cache('index:recent', callback, JSON.parse, function(key, cb) {
	    var url = urls.crandb + '/-/pkgreleases?limit=9&descending=true'
	    request(url, function(error, response, body) {
	        if (error) { cb(error); }
                try {
	            var pkgs = JSON.parse(body)
		        .map(function(x) { return clean_package(x.package) });
	            cb(null, JSON.stringify(pkgs));
                } catch(err) {
                    return cb(err);
                }
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

module.exports = recent;
