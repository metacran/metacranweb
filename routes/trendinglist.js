var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');
var clean_package = require('../lib/clean_package');

router.get('/', function(req, res) {

    var url = urls.cranlogs + '/trending';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	var pkgnames = JSON.parse(body)
	    .map(function(x) { return '"' + x.package + '"'; });
	var url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
	request(url2, function(error, response, body) {
	    if (error || response.statusCode != 200) {
		return handle_error(res);
	    }
	    var pkgs = JSON.parse(body);
	    var keys = Object.keys(pkgs);
	    var pkg_array = [];
	    for (k in keys) { console.log(k); pkg_array.push(pkgs[keys[k]]); }
	    res.render(
		'pkglist',
		{ 'pkgs': pkg_array.map(clean_package),
		  'title': 'Trending packages',
		  'paging': false,
		  'number': false
		});

	})
    })
})

module.exports = router;
