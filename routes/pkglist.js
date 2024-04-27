import express from 'express';
var router = express.Router();
import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

var re_full = new RegExp('^/([\\w\\.]+)?$')

router.get(re_full, async function (req, res, next) {
	try {
		var from = req.params[0];
		await do_query(res, next, from, req.query);
	} catch (err) {
		next(err);
	}
})

async function do_query(res, next, from, query) {
	const startkey = query.startkey || from || '';
	const url = urls.crandb + '/-/latest?limit=100&startkey="' +
		startkey + '"';
	var pkgs = await ky.get(url).json();
	for (const p in pkgs) { pkgs[p] = clean_package(pkgs[p]); }
	res.render('pkglist', {
		'pkgs': pkgs,
		'title': 'All packages',
		'paging': true,
		'number': false
	});
}

export default router;
