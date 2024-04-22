import ky from 'ky';
import get_packages from '../lib/get_packages.js';
import urls from '../lib/urls.js';

function get_packages_by(maint, callback) {

    try {
        var url = urls.crandb + '/-/maintainer?key=' +
	    encodeURIComponent(JSON.stringify(maint))

        request(url, function(error, response, body) {
	    if (error || response.statusCode != 200) { return callback(error); }
            try {
	        var pkgnames = JSON.parse(body).map(function(x) { return x[1]; });

	        get_packages(pkgnames, function(error, pkgs) {
                    try {
	                if (error || !pkgs[0]) { return callback(error || !pkgs[0]); }
	                return callback(null, pkgs);
                    } catch(err) {
                        return callback(err);
                    }
	        })
            } catch(err) {
                return callback(err);
            }
        })

    } catch(err) {
        return callback(err);
    }
}

export default get_packages_by;
