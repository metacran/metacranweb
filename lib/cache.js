var redis = require('redis');
var urls = require('../lib/urls');
var client = redis.createClient(urls.redis_port, urls.redis_host);

// When do things expire?
var expires = {
    'ghstars:': 60 * 60, 	// GitHub stars, 1 hour
    'news:':    60 * 60 * 5, 	// NEWS, 5 hours
    'package:': 60 * 60,        // Package info, 1 hour
    'pkgtv:':   60 * 60 * 24,   // Task views for a package, 1 day
    'readme:':  60 * 60 * 5,    // Package README, 5 hours
    'revdeps:': 60 * 60,        // Package reverse dependencies, 1 hour

    'index:num-active':     60 * 60,       // # active pkgs, 1 hour
    'index:num-downloads':  60 * 60 * 24,  // # downloads, 1 day
    'index:num-maint':      60 * 60,       // # maintainers, 1 hour
    'index:num-updates':    60 * 60 * 24,  // # updates last week
    'index:recent':         60 * 10,       // # recent packages, 10 minutes
    'index:top-downloaded': 60 * 60 * 24,  // top downloaded, 1 day
    'index:top-starred':    60 * 60 * 5,   // top starred, 5 hours
    'index:trending':       60 * 60 * 24   // trending packages
};

function get_expiry(key) {
    var exps = Object.keys(expires);
    for (var e in exps) {
	var ee = exps[e];
	if (key.match(ee)) { return expires[ee]; }
    }

    return 5 * 60;		// Default is five minutes
}

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
		add_to_cache(key, result);
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

function add_to_cache(key, value) {
    var exp = get_expiry(key);
    client.set(key, value, 'EX', exp);
    console.log("Adding to cache: " + key + ", expires: ", exp);
}

module.exports = cache;
