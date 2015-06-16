var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

function top_revdeps(callback) {

    cache('index:top-revdeps', callback, JSON.parse, function(key, cb) {
	var url = urls.crandb + '/-/topdeps/devel';
	request(url, function(error, response, body) {
	    if (error || response.statusCode != 200) { cb(error); }
	    var pkgs = JSON.parse(body)
		.map(function(x) { return '"' + Object.keys(x)[0] + '"' })
		.slice(0, 9);
	    var url = urls.crandb + '/-/versions?keys=[' + pkgs.join(',') + ']';
	    request(url, function(error, response, body) {
		if (error) { return cb(error); }
		var pkgs = JSON.parse(body);
		var keys = Object.keys(pkgs);
		var pkg_array = [];
		for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
		cb(null, JSON.stringify(pkg_array.map(clean_package)));
	    })

	});
    });
}

module.exports = top_revdeps;
