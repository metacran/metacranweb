import github_username from 'github-username';
import gh_user from 'gh-user';

var gh_token = process.env.GH_TOKEN || null;

async function get_gh_username(email) {
	try {
		if (!gh_token) { throw "No GitHub token"; }
		const user = await github_username(email, gh_token);
		try {
			const record = await gh_user(user, gh_token);
		} catch (err) {
			return { 'login': user };
		}
		return record;
	} catch (err) {
		return { };
	}
}

export default get_gh_username;
