var express = require('express');
var router = express.Router();
var request = require('request');
var get_maint = require('../lib/get_maint');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');
var clean_package = require('../lib/clean_package');

router.get('/', function(req, res) {
    res.render('underconstruction');
})

re_full = new RegExp("^/(.+)$");
router.get(re_full, function(req, res) {

    var maint = req.params[0];
    var url = urls.crandb + '/-/maintainer?key=' +
	encodeURIComponent(JSON.stringify(maint))

    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }

	var pkgnames = JSON.parse(body)
	    .map(function(x) { return '"' + x[1] + '"'; });
	
	var url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
	request(url2, function(error, response, body) {
	    if (error || response.statusCode != 200) {
		return handle_error(res);
	    }
	    var pkgs = JSON.parse(body);
	    var keys = Object.keys(pkgs);
	    var pkg_array = [];
	    for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
	    var cleanpkg = pkg_array.map(clean_package);
	    if (!pkg_array[0]) { return handle_error(res); }
	    var name = pkg_array[0].Maintainer;
	    
	    res.render(
		'pkglist',
		{ 'pkgs': cleanpkg,
		  'title': 'Packages by ' + name,
		  'paging': false,
		  'number': false
		});
	})
    })
})

module.exports = router;
