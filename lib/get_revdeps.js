import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';

function get_revdeps(pkg, callback) {

    try {
        cache('revdeps:' + pkg, callback, JSON.parse, function(key, cb) {
	    var url = urls.crandb + '/-/revdeps/' + pkg;
	    request(url, function(error, response, body) {
	        cb(error || response.statusCode != 200, body || '{}');
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

export default get_revdeps;
