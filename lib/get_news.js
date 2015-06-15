var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');

function cleanup(x) { return JSON.parse(x).html; }

function get_news(package, callback) {

    cache('news:' + package, callback, cleanup, function(key, cb) {
	var url = urls.docsdb + '/news/' + package;
	request(url, function(error, response, body) {
	    if (error || response.statusCode != 200) {
		cb(null, undefined);
	    } else {
		cb(null, body);
	    }
	});
    });
}

module.exports = get_news;
