import express from 'express';
var router = express.Router();
import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

router.get('/', async function (req, res, next) {
	try {
		const url = urls.crandb + '/-/pkgreleases?limit=100&descending=true';
		const body = await ky.get(url).json();
		const pkgs = body.map(x => x.package);
		res.render('pkglist', {
			'pkgs': pkgs.map(clean_package),
			'title': 'Most recently updated packages',
			'paging': false,
			'number': false,
			'pagetitle': 'Most recent @ METACRAN'
		});
	} catch (err) {
		next(err);
	}
})

export default router;
