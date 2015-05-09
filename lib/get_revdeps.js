var request = require('request');
var urls = require('../lib/urls');

function get_revdeps(package, callback) {
    var url = urls.crandb + '/-/revdeps/' + package;
    request(url, function(error, response, body) {
	callback(error, error || JSON.parse(body));
    });
}

module.exports = get_revdeps;
