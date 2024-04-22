import ky from 'ky';
import cache from '../lib/cache.js';
import urls from '../lib/urls.js';
import comma_numbers from 'comma-numbers';
const comma = comma_numbers();

function cleanup(x) { return comma(JSON.parse(x)[0].downloads); }

function num_downloads(callback) {

    try {
        cache('index:num-downloads', callback, cleanup, function(key, cb) {
	    var url = urls.cranlogs + '/downloads/total/last-week';
	    request(url, function(error, response, body) {
	        if (error) { return cb(error); }
	        cb(null, body);
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

export default num_downloads;
