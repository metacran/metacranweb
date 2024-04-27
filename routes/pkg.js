import express from 'express';
var router = express.Router();
import get_package from '../lib/get_package.js';
import get_revdeps from '../lib/get_revdeps.js';
import pkg_link from '../lib/pkg_link.js';
import meta from '../lib/meta.js';
import orcid from 'identifiers-orcid';

const re_full = new RegExp("^/([\\w\\.]+)$", 'i');

router.get(re_full, async function (req, res, next) {
	try {
		var pkg = req.params[0];
		await do_query(res, next, pkg);
	} catch (err) {
		next(err);
	}
})

async function do_query(res, next, pkg) {
	const p1 = get_package(pkg);
	const p2 = get_revdeps(pkg);
	const ret = await Promise.all([p1, p2]);
	var results = { pkg: ret[0], revdeps: ret[1] };
	results.pkg_link = pkg_link;
	results.github_repo = meta.get_gh_repo(results.pkg);
	results.pdf_url = 'https://cran.rstudio.com/web/packages/';
	results.pagetitle = results.pkg.Package + ' @ METACRAN';
	if (results.pkg.Author) {
		// split authors on commas not inside []
		var authors_parsed = results.pkg.Author.split(
			/(?!\B\[[^\]]*),(?![^\[]*\]\B)/g
		);
		// extract ORCID iDs
		authors_parsed = authors_parsed.map((a) => {
			var author = {};
			author.name_role = a.trim();
			const id = orcid.extract(author.name_role);
			if (id.length > 0) {
				author.orcid = id;
				author.name_role = author.name_role.replace(
					/(\(|\<).*?(\)|\>)\)?\s*/g,
					''
				);
			}
			return (author);
		});
		results.pkg.authors_parsed = authors_parsed;
	}
	res.render('package', results);
}

export default router;
