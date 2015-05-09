var request = require('request');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

function recent(callback) {

    var url = urls.crandb + '/-/pkgreleases?limit=9&descending=true'
    request(url, function(error, response, body) {
	if (error) { callback(error, undefined); }
	var pkgs = JSON.parse(body)
	    .map(function(x) { return clean_package(x.package) });
	callback(error, pkgs);

    })
}

module.exports = recent;
