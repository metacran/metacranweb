var request = require('request');
var get_packages = require('../lib/get_packages');
var urls = require('../lib/urls');


function get_packages_by(maint, callback) {

    var url = urls.crandb + '/-/maintainer?key=' +
	encodeURIComponent(JSON.stringify(maint))

    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return callback(error); }

	var pkgnames = JSON.parse(body).map(function(x) { return x[1]; });

	get_packages(pkgnames, function(error, pkgs) {
	    if (error || !pkgs[0]) { return callback(error || !pkgs[0]); }
	    return callback(null, pkgs);
	})
    })

}

module.exports = get_packages_by;
