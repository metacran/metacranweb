import express from 'express';
var router = express.Router();
import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

router.get('/', async function(req, res, next) {
	try {
    const url = urls.cranlogs + '/trending';
		const body = await ky.get(url).json();
    const pkgnames = body.map(x => '"' + x.package + '"');
	  const url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
		const pkgs = await ky.get(url2).json();
	  const keys = Object.keys(pkgs);
		var pkg_array = [];
	  for (const key of keys) { pkg_array.push(pkgs[key]); }
    res.render('pkglist', {
			 'pkgs': pkg_array.map(clean_package),
		   'title': 'Trending packages',
		   'paging': false,
		   'number': false,
		   'pagetitle': 'Trending @ METACRAN'
		});
	} catch(err) {
		next(err);
	}
});

export default router;
