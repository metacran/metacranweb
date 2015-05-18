var request = require('request');
var urls = require('../lib/urls');

function get_news(package, callback) {
    var url = urls.docsdb + '/news/' + package;
    console.log(url);
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return callback(null, undefined);
	}
	return callback(null, JSON.parse(body).html);
    })
}

module.exports = get_news;
