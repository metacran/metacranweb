import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

async function refresh(key) {
	const url = urls.cranlogs + '/trending';
	const body = (await ky.get(url).json()).slice(0, 10);
	const pkgs = body.map(function(x) {
		return '"' + x.package + '"';
	});
  const url2 = urls.crandb + '/-/versions?keys=[' + pkgs.join(',') + ']';
	const body2 = await ky.get(url2).json();
	const keys = Object.keys(body2);
	var pkg_array = [];
  for (const key of keys) { pkg_array.push(body2[key]); }
	const ret = pkg_array.map(clean_package);
	return JSON.stringify(ret);
}

async function trending(callback) {
  return cache('index:trending', JSON.parse, refresh);
}

export default trending;
