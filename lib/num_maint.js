var request = require('request');
var cache = require('../lib/cache');
var urls = require('../lib/urls');
var comma = require('comma-numbers')();

function cleanup(x) { return comma(JSON.parse(x).count); }

function num_maint(callback) {

    try {
        cache('index:num-maint', callback, cleanup, function(key, cb) {
	    var url = urls.crandb + '/-/nummaint';
	    request(url, function(error, response, body) {
	        if (error) { return cb(error); }
	        cb(error, body);
	    });
        });
    } catch(err) {
        return callback(err);
    }
}

module.exports = num_maint;
