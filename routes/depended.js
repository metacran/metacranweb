import express from 'express';
var router = express.Router();
import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

router.get('/', async function(req, res, next) {
	try {
    const depended = await cache('list:top-depended', JSON.parse, refresh);
    res.render('pkglist', {
			'pkgs': depended,
		  'title': 'Most depended upon',
		  'paging': false,
		  'pagetitle': 'Most depended upon'
		});
	} catch (err) {
		next(err);
	}
});

async function refresh(key) {
  const url = urls.crandb + '/-/deps/devel';
	const obj = await ky.get(url).json();
  const pkgs = Object.keys(obj);
  const pkgnames = pkgs.map(p => [ p, obj[p] ])
    .sort((a, b) => a[1] > b[1] ? -1 : 1)
    .splice(0, 99)
    .map(x => '"' + x[0] + '"');

	const url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
  const pkgs2 = await ky.get(url2).json();
  const keys2 = Object.keys(pkgs2);
  var pkg_array = [];
  for (const key of keys2) { pkg_array.push(pkgs2[key]); }
  pkg_array = pkg_array.map(clean_package);
  return JSON.stringify(pkg_array);
}

export default router;
