var request = require('request');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');
var handle_error = require('../lib/handle_error');

function top_downloaded(callback) {

    var url = urls.cranlogs + '/top/last-week/9';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return handle_error(res);
	}
	var pbody = JSON.parse(body).downloads;
	var pkgs = pbody.map(function(x) { return '"' + x.package + '"'; });

	var url = urls.crandb + '/-/versions?keys=[' + pkgs.join(',') + ']';
	request(url, function(error, response, body) {
	    if (error || response.statusCode != 200) {
		return handle_error(res);
	    }
	    var pkgs = JSON.parse(body);
	    var keys = Object.keys(pkgs);
	    var pkg_array = [];
	    for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
	    callback(pkg_array.map(clean_package));
	})
    })
}

module.exports = top_downloaded;
