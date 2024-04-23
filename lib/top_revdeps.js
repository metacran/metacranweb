import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

async function refresh(key) {
	const url = urls.crandb + '/-/topdeps/devel';
	const body = await ky.get(url).json();
	const pkgs = body
		.map(function(x) { return '"' + Object.keys(x)[0] + '"' })
		.slice(0, 9);
	const url2 = urls.crandb + '/-/versions?keys=[' + pkgs.join(',') + ']';
	const pkgs2 = await ky.get(url2).json();
	const keys = Object.keys(pkgs2);
	var pkg_array = [];
	for (const key of keys) {
		pkg_array.push(pkgs2[key]);
	}
	const ret = pkg_array.map(clean_package);
	return JSON.stringify(ret);
}

async function top_revdeps(callback) {
	return cache('index:top-revdeps', JSON.parse, refresh);
}

export default top_revdeps;
