var request = require('request');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

function trending(callback) {

    var url = urls.cranlogs + '/trending';
    request(url, function(error, response, body) {
	if (error) { return callback(error, undefined); }
	var pbody = JSON.parse(body).slice(0, 10);
	var pkgs = pbody.map(function(x) { return '"' + x.package + '"'; });

	var url = urls.crandb + '/-/versions?keys=[' + pkgs.join(',') + ']';
	request(url, function(error, response, body) {
	if (error) { return callback(error, undefined); }
	    var pkgs = JSON.parse(body);
	    var keys = Object.keys(pkgs);
	    var pkg_array = [];
	    for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
	    callback(false, pkg_array.map(clean_package));
	})
    })
}

module.exports = trending;
