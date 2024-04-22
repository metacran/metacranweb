import github_username from 'github-username';
import gh_user from 'gh-user';

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

export default get_gh_username;
