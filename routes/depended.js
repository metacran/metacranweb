var express = require('express');
var router = express.Router();
var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

router.get('/', function(req, res, next) {

    cache(
	'list:top-depended',
	// callback
	function(err, result) {
            if (err) return next(err);
            try {
	        res.render(
		    'pkglist',
		    { 'pkgs': result,
		      'title': 'Most depended upon',
		      'paging': false,
		      'pagetitle': 'Most depended upon'
		    });
            } catch(err) {
                return next(err);
            }
	},
	JSON.parse,
	// refresh
	function(key, cb) {
            try {
	        var url = urls.crandb + '/-/deps/devel';
	        request(url, function(error, response, body) {
		    if (error || response.statusCode != 200) { cb(error); }
                    try {
		        var obj = JSON.parse(body);
		        var pkgs = Object.keys(obj);
		        var pkgnames = pkgs.map(function(p) { return [ p, obj[p] ]; })
		            .sort(function(a,b) {
			        if (a[1] > b[1]) { return -1; } else { return 1; } })
		            .splice(0, 99)
		            .map(function(x) { return '"' + x[0] + '"'; });
		        var url2 = urls.crandb + '/-/versions?keys=[' +
		            pkgnames.join(',') + ']';
		        console.log(url2);
		        request(url2, function(error, response, body) {
		            if (error || response.statusCode != 200) { cb(error); }
                            try {
		                var pkgs = JSON.parse(body);
		                var keys = Object.keys(pkgs);
		                var pkg_array = [];
		                for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
		                pkg_array = pkg_array.map(clean_package);
		                console.log(pkg_array);
		                cb(null, JSON.stringify(pkg_array));
                            } catch(err) {
                                return cb(err);
                            }
		        })
                    } catch(err) {
                        return cb(err);
                    }
	        })
            } catch(err) {
                return next(err);
            }
	}
    );
})

module.exports = router;
