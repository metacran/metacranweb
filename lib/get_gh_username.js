var request = require('request');
var gh_user = require('gh-user');
var cache = require('../lib/cache');

var gh_token = process.env.GH_TOKEN || null;

// Look up a GitHub login from an email address. We do not use the
// 'github-username' package, because it throws (and crashes the app)
// when the search API returns no 'items', e.g. on rate limiting.
//
// Calls back with an error if the API call failed, and with a null
// login if the search worked, but found no user.
function github_username(email, token, callback) {
    request({
	url: 'https://api.github.com/search/users',
	qs: { q: email + ' in:email' },
	headers: {
	    'User-Agent': 'metacranweb',
	    'Authorization': 'token ' + token
	},
	json: true
    }, function(err, response, body) {
	if (err) { return callback(err); }
	if (response.statusCode !== 200 || !body ||
	    !Array.isArray(body.items)) {
	    return callback(new Error("GitHub search failed for " + email));
	}
	if (body.items.length === 0 || !body.items[0].login) {
	    return callback(null, null);
	}
	callback(null, body.items[0].login);
    });
}

// Look up the GitHub user. The result is a JSON string, so we can
// store it in the cache. "Not found" is cached as well, but failed
// API calls (e.g. rate limiting) are not.
function refresh(key, callback) {
    var email = key.replace(/^ghuser:/, '');

    github_username(email, gh_token, function(err, user) {
	if (err) { return callback(err); }
	if (!user) { return callback(null, '{}'); }

	gh_user(user, gh_token, function(err, record) {
	    if (err) { return callback(err); }
	    callback(null, JSON.stringify(record));
	})
    })
}

function get_gh_username(email, callback) {

    if (!gh_token) { return callback(null, { }); }

    cache('ghuser:' + email, function(err, record) {
	// Never return an error
	if (err) { return callback(null, { }); }
	callback(null, record);
    }, JSON.parse, refresh);
}

module.exports = get_gh_username;
