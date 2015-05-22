var github_username = require('github-username');
var gh_user = require('gh-user');

var gh_token = process.env.GH_TOKEN || null;

function get_gh_username(email, callback) {

    if (!gh_token) { return callback(null, { }); }

    github_username(email, gh_token, function(err, user) {

	// Never return an error
	if (err) { return callback(null, { }); }

	gh_user(user, gh_token, function(err, record) {

	    // Never return an error
	    if (err) { return callback(null, { 'login': user }); }

	    callback(null, record);
	})
    })
}

module.exports = get_gh_username;
