import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';
import clean_deps from '../lib/clean_deps.js';

function cleanup(pkg) {
    return clean_deps(clean_package(JSON.parse(pkg)));
}

function get_package(pkg, callback) {

    try {
        cache('package:' + pkg, callback, cleanup, function(key, cb) {
	    var url = urls.crandb + '/' + pkg;
	    request(url, function(error, response, body) {
	        cb(error || response.statusCode != 200, body || '{}');
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

export default get_package;
