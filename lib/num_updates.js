var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var comma = require('comma-numbers')();

function cleanup(x) { return comma(JSON.parse(x)); }

function num_updates(callback) {

    cache('index:num-updates', callback, cleanup, function(key, cb) {
	var tmpd = new Date();
	tmpd.setDate(tmpd.getDate() - 7);
	var weekago = tmpd.toISOString();
	var url = urls.crandb + '/-/numpkgreleases?start_key="' + weekago + '"';
	request(url, function(error, response, body) {
	    if (error) { return cb(error); }
	    cb(null, body);
	});
    });
}

module.exports = num_updates;
