import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';
import clean_deps from '../lib/clean_deps.js';

function cleanup(pkg) {
  return clean_deps(clean_package(JSON.parse(pkg)));
}

async function get_package(pkg) {
  return cache(
    'package:' + pkg,
    cleanup,
    async function refresh(_key) {
        try {
          const url = urls.crandb + '/' + pkg;
          const body = ky.get(url).text();
          return body;
        } catch (err) {
          return JSON.stringify({});
        }
      }
    );
}

export default get_package;
