var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');
var clean_package = require('../lib/clean_package');

router.get('/', function(req, res) {

    var url = urls.docsdb + '/gh-stars/_design/app/_view/' +
	'num_stars?descending=true&limit=100';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return handle_error(res, error || response.statusCode);
	}
	var pkgnames = JSON.parse(body)
	    .rows
	    .map(function(x) { return '"' + x.id + '"'; });
	var url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
	request(url2, function(error, response, body) {
	    if (error || response.statusCode != 200) {
		return handle_error(res, error || response.statusCode);
	    }
	    var pkgs = JSON.parse(body);
	    var keys = Object.keys(pkgs);
	    var pkg_array = [];
	    for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
	    res.render(
		'pkglist',
		{ 'pkgs': pkg_array.map(clean_package),
		  'title': 'Most stars at GitHub',
		  'paging': false,
		  'number': false,
		  'pagetitle': 'Most starred METACRAN'
		});
	})
    })
})

module.exports = router;
