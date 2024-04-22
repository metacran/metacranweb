import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

function recent(callback) {

    try {
        cache('index:recent', callback, JSON.parse, function(key, cb) {
	    var url = urls.crandb + '/-/pkgreleases?limit=9&descending=true'
	    request(url, function(error, response, body) {
	        if (error) { cb(error); }
                try {
	            var pkgs = JSON.parse(body)
		        .map(function(x) { return clean_package(x.package) });
	            cb(null, JSON.stringify(pkgs));
                } catch(err) {
                    return cb(err);
                }
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

export default recent;
