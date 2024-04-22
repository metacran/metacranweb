import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

function get_packages(pkgnames, callback) {

    try {
        var pkgnames = pkgnames.map(function(x) { return '"' + x + '"'; });
        var url2 = urls.crandb + '/-/versions?keys=[' + pkgnames.join(',') + ']';
        request(url2, function(error, response, body) {
	    if (error || response.statusCode != 200) { return callback(error); }
            try {
	        var pkgs = JSON.parse(body);
	        var keys = Object.keys(pkgs);
	        var pkg_array = [];
	        for (k in keys) { pkg_array.push(pkgs[keys[k]]); }
	        callback(null,  pkg_array.map(clean_package))
            } catch(err) {
                return callback(err);
            }
        })
    } catch(err) {
        return callback(err);
    }

}

export default get_packages;
