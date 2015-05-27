var request = require('request');
var urls = require('../lib/urls');

function get_pkg_tvs(package, callback) {
    var url = urls.docsdb + '/task-view-pkgs/' + package;
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return callback(null, undefined);
	}
	return callback(null, JSON.parse(body).task_views);
    })
}

module.exports = get_pkg_tvs;
