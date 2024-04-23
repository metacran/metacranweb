import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import comma_numbers from 'comma-numbers';
const comma = comma_numbers();

function cleanup(x) { return comma(JSON.parse(x)); }

async function refresh(_key) {
    const url = urls.crandb + '/-/numactive';
    const body = await ky.get(url).json();
    return JSON.stringify(body);
}

function num_active() {
    return cache('index:num-active', cleanup, refresh);
}

export default num_active;
