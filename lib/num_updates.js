import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import comma_numbers from 'comma-numbers';
const comma = comma_numbers();

function cleanup(x) { return comma(x); }

async function refresh(key) {
  var tmpd = new Date();
  tmpd.setDate(tmpd.getDate() - 7);
  const weekago = tmpd.toISOString();
  const url = urls.crandb + '/-/numpkgreleases?start_key="' + weekago + '"';
  const body = await ky.get(url).json();
  return body;
}

async function num_updates() {
  return cache('index:num-updates', cleanup, refresh);
}

export default num_updates;
