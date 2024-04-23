import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import comma_numbers from 'comma-numbers';
const comma = comma_numbers();

function cleanup(x) { return comma(JSON.parse(x).count); }

async function refresh(_key) {
  const url = urls.crandb + '/-/nummaint';
  const body = await ky.get(url).json();
  return JSON.stringify(body);
}

async function num_maint(callback) {
    return cache('index:num-maint', cleanup, refresh);
}

export default num_maint;
