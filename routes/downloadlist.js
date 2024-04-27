import express from 'express';
var router = express.Router();
import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

router.get('/', async function (req, res, next) {
	try {
		const url = urls.cranlogs + '/top/last-week/100';
		const body = await ky.get(url).json();
		const pkgnames = body.downloads
			.map(x => '"' + x.package + '"');
		const url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
		const pkgs = await ky.get(url2).json();
		var pkg_array = [];
		Object.keys(pkgs).map(k => pkg_array.push(pkgs[k]));
		res.render('pkglist', {
			'pkgs': pkg_array.map(clean_package),
			'title': 'Top downloaded packages',
			'paging': false,
			'number': false,
			'pagetitle': 'Top downloaded METACRAN'
		});
	} catch (err) {
		next(err);
	}
})

export default router;
