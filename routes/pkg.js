var express = require('express');
var router = express.Router();
var get_package = require('../lib/get_package');
var get_revdeps = require('../lib/get_revdeps');
var get_readme = require('../lib/get_readme');
var get_news = require('../lib/get_news');
var get_pkg_tvs = require('../lib/get_pkg_tvs');
var get_gh_stars = require('../lib/get_gh_stars');
var async = require('async');
var handle_error = require('../lib/handle_error');
var pkg_link = require('../lib/pkg_link');
var meta = require('metacran-node');
var orcid = require('identifiers-orcid');

re_full = new RegExp("^/([\\w\\.]+)$", 'i');

router.get(re_full, function(req, res) {
    var package = req.params[0];
    do_query(res, package);
})

function do_query(res, package) {

    async.parallel(
	{
	    'pkg': function(cb) {
		get_package(package, function(e, r) { cb(e, r)}) },
	    'revdeps': function(cb) {
		get_revdeps(package, function(e, r) { cb(e, r)}) },
	    'readme': function(cb) {
		get_readme(package, function(e, r) { cb(e, r)}) },
	    'news': function(cb) {
		get_news(package, function(e, r) { cb(e, r)}) },
	    'taskviews': function(cb) {
		get_pkg_tvs(package, function(e, r) { cb(e, r)}) },
	    'stars': function(cb) {
		get_gh_stars(package, function(e, r) { cb(e, r)}) }
	},
	function(err, results) {
	    if (err) { return handle_error(res, err) }
	    results.pkg_link = pkg_link;
	    results.github_repo = meta.get_gh_repo(results.pkg);
	    results.pdf_url = 'http://cran.rstudio.com/web/packages/';
	    results.pagetitle = results.pkg.Package + ' @ METACRAN';
		
		// split authors on commas not inside []
		authors_parsed = results.pkg.Author.split(/(?!\B\[[^\]]*),(?![^\[]*\]\B)/g);
		// extract ORCID iDs
		authors_parsed = authors_parsed.map((a) => {
			author = {};
			author.name_role = a.trim();
			id = orcid.extract(author.name_role);
			if(id.length > 0) {
				author.orcid = id;
				author.name_role = author.name_role.replace(/(\(|\<).*?(\)|\>)\)?\s*/g, '');
			}
			return(author);
		});
		results.pkg.authors_parsed = authors_parsed;		
		res.render('package', results);
	}
    )
}

module.exports = router;
