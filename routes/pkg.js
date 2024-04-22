import express from 'express';
var router = express.Router();
import get_package from '../lib/get_package.js';
import get_revdeps from '../lib/get_revdeps.js';
import async from 'async';
import pkg_link from '../lib/pkg_link.js';
import meta from '../lib/meta.js';
import orcid from 'identifiers-orcid';

const re_full = new RegExp("^/([\\w\\.]+)$", 'i');

router.get(re_full, function(req, res, next) {
    var pkg = req.params[0];
    do_query(res, next, pkg);
})

function do_query(res, next, pkg) {

    async.parallel(
	{
	    'pkg': function(cb) {
		get_package(pkg, function(e, r) { cb(e, r)}) },
	    'revdeps': function(cb) {
		get_revdeps(pkg, function(e, r) { cb(e, r)}) }
	},
	function(err, results) {
	    if (err) { return next(err) }
            try {
	        results.pkg_link = pkg_link;
	        results.github_repo = meta.get_gh_repo(results.pkg);
	        results.pdf_url = 'https://cran.rstudio.com/web/packages/';
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

export default router;
