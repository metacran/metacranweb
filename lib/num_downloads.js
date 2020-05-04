var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var comma = require('comma-numbers')();

function cleanup(x) { return comma(JSON.parse(x)[0].downloads); }

function num_downloads(callback) {

    try {
        cache('index:num-downloads', callback, cleanup, function(key, cb) {
	    var url = urls.cranlogs + '/downloads/total/last-week';
	    request(url, function(error, response, body) {
	        if (error) { return cb(error); }
	        cb(null, body);
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

module.exports = num_downloads;
