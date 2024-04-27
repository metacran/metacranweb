import express from 'express';
var router = express.Router();
import ky from 'ky';
import async from 'async';
import urls from '../lib/urls.js';
import pkg_link from '../lib/pkg_link.js';
import get_packages_by from '../lib/get_packages_by.js';
import get_photo_url from '../lib/get_photo_url.js';
import get_gh_username from '../lib/get_gh_username.js';

router.get('/', async function (req, res, next) {
	try {
		const startkey = req.query.startkey || '';
		const url = urls.crandb +
			'/-/maintainernames?group_level=2&limit=100&startkey=["' +
			encodeURI(startkey) + '"]';
		const pp0 = await ky.get(url).json();
		const pp = pp0.map(function (x) {
			return {
				'name': x[0][0],
				'email': x[0][1],
				'num_pkgs': x[1]
			};
		});
		const keys = pp.map(function (x) {
			return '"' + encodeURIComponent(x.email) + '"';
		}).join(',');
		const url2 = urls.crandb + '/-/maintainer?keys=[' + keys + ']';
		const body = await ky.get(url2).json();
		var packages = {};
		body.map(function (x) {
			const email = x[0];
			const pkg = x[1];
			if (!packages[email]) { packages[email] = []; }
			if (packages[email].indexOf(pkg) < 0) {
				packages[email].push(pkg);
			}
		})
		res.render('maint', {
			'people': pp,
			'packages': packages,
			'pkg_link': pkg_link,
			'pagetitle': 'METACRAN maintainers'
		});
	} catch (err) {
		next(err);
	}
})

const re_full = new RegExp("^/(.+)$");
router.get(re_full, async function (req, res, next) {
	try {
		const maint = req.params[0];
		const p1 = get_packages_by(maint);
		const p2 = get_photo_url(maint);
		const p3 = get_gh_username(maint);
		const ret = await Promise.all([p1, p2, p3]);
		var results = { pkgs: ret[0], photo: ret[1], ghuser: ret[2] };
		results.email = maint;
		results.title = 'Packages by ' +
			results.pkgs[0].Maintainer.replace(/^'(.*)'$/, '$1');
		results.paging = false;
		results.number = false;
		results.pagetitle = 'METACRAN maintainers';
		results.npr = 3;
		results.cw = "col-md-4";
		res.render('maint1', results);
	} catch (err) {
		next(err);
	}
})

export default router;
