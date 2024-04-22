import express from 'express';
var router = express.Router();
import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

router.get('/', function(req, res, next) {

    var url = urls.cranlogs + '/trending';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return next(error || response.statusCode);
	}
        try {
	    var pkgnames = JSON.parse(body)
	        .map(function(x) { return '"' + x.package + '"'; });
	    var url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
	    request(url2, function(error, response, body) {
	        if (error || response.statusCode != 200) {
		    return next(error || response.statusCode);
	        }
                try {
	            var pkgs = JSON.parse(body);
	            var keys = Object.keys(pkgs);
	            var pkg_array = [];
	            for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
	            res.render(
		        'pkglist',
		        { 'pkgs': pkg_array.map(clean_package),
		          'title': 'Trending packages',
		          'paging': false,
		          'number': false,
		          'pagetitle': 'Trending @ METACRAN'
		        });
                } catch(err) {
                    return next(err);
                }
	    })
        } catch(err) {
            return next(err);
        }
    })
})

export default router;
