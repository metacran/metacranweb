const fixed_gh_repos = {
    'RVowpalWabbit': 'eddelbuettel/rvowpalwabbit',
    'htmlwidgets': 'ramnathv/htmlwidgets',
    'DiagrammeR': 'rich-iannone/DiagrammeR',
    'visNetwork': 'dataknowledge/visNetwork'
}

function get_gh_repo(pkg) {

    if (pkg.Package in fixed_gh_repos) {
	return fixed_gh_repos[pkg.Package];
    }

    if (pkg.BugReports &&
	pkg.BugReports.match(/https?:\/\/github\.com\//)) {
	repo_field = pkg.BugReports;
    } else if (pkg.URL && pkg.URL.match(/https?:\/\/github\.com\//)) {
	repo_field = pkg.URL;
    } else {
	repo_field = "";
    }
    repo = repo_field
	.replace(/^[\s\S]*https?:\/\/github\.com\/([^\/]+\/[^\/, <]+)\/?[\s\S]*$/m, '$1');
    return repo;
}

const api = { 'get_gh_repo': get_gh_repo };

export default api;
