var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');
var clean_package = require('../lib/clean_package');

router.get('/', function(req, res) {

    var url = urls.crandb + '/-/pkgreleases?limit=100&descending=true';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return handle_error(res, error || response.statusCode);
	}
	var pkg_array = JSON.parse(body)
	    .map(function(x) { return x.package; });
	res.render(
	    'pkglist',
	    { 'pkgs': pkg_array.map(clean_package),
	      'title': 'Most recently updated packages',
	      'paging': false,
	      'number': false,
	      'pagetitle': 'Most recent @ METACRAN'
	    });
    })
})

module.exports = router;
