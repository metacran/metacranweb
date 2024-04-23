import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

async function refresh(key) {
  const url = urls.crandb + '/-/pkgreleases?limit=9&descending=true';
  const pkgs = await ky.get(url).json();
  const ret = pkgs.map(function(x) { return clean_package(x.package) });
  return JSON.stringify(ret);
}

async function recent(callback) {
  return cache('index:recent', JSON.parse, refresh);
}

export default recent;
