import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';

async function get_revdeps(pkg) {
  return cache(
    'revdeps:' + pkg,
    JSON.parse,
    async function refresh(_key) {
      try {
        const url = urls.crandb + '/-/revdeps/' + pkg;
        const body = await ky.get(url).text();
        return body;
      } catch (err) {
        return JSON.stringify({});
      }
    }
  );
}

export default get_revdeps;
