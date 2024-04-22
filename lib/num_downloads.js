import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import comma_numbers from 'comma-numbers';
const comma = comma_numbers();

function cleanup(x) { return comma(x[0].downloads); }

async function refresh(key) {
  const url = urls.cranlogs + '/downloads/total/last-week';
  const body = await ky.get(url).json();
  return body;
}

async function num_downloads() {
  return cache('index:num-downloads', cleanup, refresh);
}

export default num_downloads;
