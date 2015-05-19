var request = require('request');
var urls = require('../lib/urls');

function get_readme(package, callback) {
    var url = urls.docsdb + '/readme/' + package;
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return callback(null, undefined);
	}
	return callback(null, JSON.parse(body).html);
    })
}

module.exports = get_readme;
