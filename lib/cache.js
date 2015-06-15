var redis = require('redis');
var urls = require('../lib/urls');
var client = redis.createClient(urls.redis_port, urls.redis_host);

// Try to get a key from the cache
// 1. If the key is there, return it
// 2. If the key is not there, get the key from the remote
//    service, return it via the callback, and then put it
//    in the cache, after we returned the response.

function cache(key, callback, cleanup, refresh) {
    client.get(key, function(err, value) {
	if (err || value === null) {
	    // error, or not there, get it from remote
	    console.log(key + " not in the cache");
	    refresh(key, function(err, result) {
		if (err) { callback(err); return; }
		var clean_result = result;
		if (cleanup) { clean_result = cleanup(result); }
		callback(null, clean_result);
		client.set(key, result, 'EX', 300)
	    })

	} else {
	    // there, we are all done
	    console.log(key + " in the cache!");
	    var clean_value = value;
	    if (cleanup) { clean_value = cleanup(value); }
	    callback(null, clean_value)
	}
    })
}

module.exports = cache;
