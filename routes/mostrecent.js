var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

router.get('/', function(req, res, next) {

    var url = urls.crandb + '/-/pkgreleases?limit=100&descending=true';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return next(error || response.statusCode);
	}
        try {
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
        } catch(err) {
            return next(err);
        }
    })
})

module.exports = router;
