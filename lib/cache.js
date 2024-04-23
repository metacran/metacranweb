import { createClient } from 'redis';
import urls from '../lib/urls.js';
var client = undefined;

// When do things expire?

var expires = {
    'ghstars:': 60 * 60, 	              // GitHub stars, 1 hour
    'news:': 60 * 60 * 5,                 // NEWS, 5 hours
    'package:': 60 * 60,                  // Package info, 1 hour
    'pkgtv:': 60 * 60 * 24,               // Task views for a package, 1 day
    'readme:': 60 * 60 * 5,               // Package README, 5 hours
    'revdeps:': 60 * 60,                  // Package revdeps, 1 hour

    'index:num-active': 60 * 60,          // # active pkgs, 1 hour
    'index:num-downloads': 60 * 60 * 24,  // # downloads, 1 day
    'index:num-maint': 60 * 60,           // # maintainers, 1 hour
    'index:num-updates': 60 * 60 * 24,    // # updates last week
    'index:recent': 60 * 10,              // # recent packages, 10 minutes
    'index:top-downloaded': 60 * 60 * 24, // top downloaded, 1 day
    'index:top-starred': 60 * 60 * 5,     // top starred, 5 hours
    'index:trending': 60 * 60 * 24,       // trending packages, 1 day
    'index:top-revdeps': 60 * 60,	      // most depended upon, 1 hour

    'list:top-depended': 60 * 60 * 24     // most depended upon
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

async function cache(key, cleanup, refresh) {
    if (client === undefined) {
        client = createClient({ url: urls.redis });
        await client.connect();
    }

    try {
        var value = await client.get(key);
        if (value === null) { throw "not in the cache"; }
        if (cleanup) {
            value = cleanup(value);
        }
        return value
    } catch (err) {
        var value = await refresh(key);
        await add_to_cache(key, value);
        if (cleanup) {
            value = cleanup(value);
        }
        return value;
    }
}

async function add_to_cache(key, value) {
    if (client === undefined) {
        client = createClient({ url: urls.redis });
        await client.connect();
    }
    var exp = get_expiry(key);
    await client.set(key, value, 'EX', exp);
}

export default cache;
