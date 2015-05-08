var request = require('request');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');

function get_revdeps(package, res, callback) {
    var url = urls.crandb + '/-/revdeps/' + package;
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	callback(JSON.parse(body));
    });
}

module.exports = get_revdeps;
