import express from 'express';
var router = express.Router();
import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

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

export default router;
