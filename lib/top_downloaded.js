import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

async function refresh(key) {
	const url = urls.cranlogs + '/top/last-week/9';
	const body = await ky.get(url).json();
	const pbody = JSON.parse(body).downloads;
	const pkgs = pbody.map(function (x) { return '"' + x.package + '"'; });
	const url2 = urls.crandb + '/-/versions?keys=[' + pkgs.join(',') + ']';
	const body2 = await ky.get(url2).json();
	const pkgs2 = JSON.parse(body2);
	const keys = Object.keys(pkgs2);
	var pkg_array = [];
	for (k in keys) {
		pkg_array.push(pkgs2[keys[k]]);
	}
	return JSON.stringify(pkg_array.map(clean_package));
}

async function top_downloaded() {
	return cache('index:top-downloaded', JSON.parse, refresh);
}

export default top_downloaded;
