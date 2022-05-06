var express = require('express');
var router = express.Router();
var get_package = require('../lib/get_package');
var get_revdeps = require('../lib/get_revdeps');
var async = require('async');
var pkg_link = require('../lib/pkg_link');
var meta = require('metacran-node');
var orcid = require('identifiers-orcid');

re_full = new RegExp("^/([\\w\\.]+)$", 'i');

router.get(re_full, function(req, res, next) {
    var package = req.params[0];
    do_query(res, next, package);
})

function do_query(res, next, package) {

    async.parallel(
	{
	    'pkg': function(cb) {
		get_package(package, function(e, r) { cb(e, r)}) },
	    'revdeps': function(cb) {
		get_revdeps(package, function(e, r) { cb(e, r)}) }
	},
	function(err, results) {
	    if (err) { return next(err) }
            try {
	        results.pkg_link = pkg_link;
	        results.github_repo = meta.get_gh_repo(results.pkg);
	        results.pdf_url = 'http://cran.rstudio.com/web/packages/';
	        results.pagetitle = results.pkg.Package + ' @ METACRAN';

	        if (results.pkg.Author) {
	            // split authors on commas not inside []
	            authors_parsed = results.pkg.Author.split(/(?!\B\[[^\]]*),(?![^\[]*\]\B)/g);
	            // extract ORCID iDs
	            authors_parsed = authors_parsed.map((a) => {
	                author = {};
	                author.name_role = a.trim();
	                id = orcid.extract(author.name_role);
	                if (id.length > 0) {
		            author.orcid = id;
		        author.name_role = author.name_role.replace(/(\(|\<).*?(\)|\>)\)?\s*/g, '');
		        }
	                return(author);
		    });
	            results.pkg.authors_parsed = authors_parsed;
	        }
	        res.render('package', results);
	    } catch(err) {
                return next(err);
            }
        }
    )
}

module.exports = router;
