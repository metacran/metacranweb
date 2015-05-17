var moment = require('moment');
var linkify = require('../lib/linkify');

function clean_package(pkg) {

    // Linkify URLs
    if (pkg.URL) { pkg.URL = linkify(pkg.URL);  }
    if (pkg.BugReports) { pkg.BugReports = linkify(pkg.BugReports);  }

    // Remove newlines from title
    if (pkg.Title) { pkg.Title = pkg.Title.replace(/<U\+000a>/g, ' '); }

    // Remove newlines from description, also linkify
    if (pkg.Description) {
	pkg.Description =
	    linkify(pkg.Description.replace(/<U\+000a>/g, ' '));
    }

    // Remove newlines from Author
    if (pkg.Author) {
	pkg.Author = pkg.Author.replace(/<U\+000a>/g, ' ');
    }

    // Use 'time ago' instead of date
    if (pkg.date) { pkg.timeago = moment(pkg.date).fromNow(); }

    // Take email addess from maintainer
    if (pkg.Maintainer) {
	pkg.maintainer_email =
	    pkg.Maintainer.replace(/^.*\s*<([^>]*)>\s*$/, '$1');
    }

    // Remove email address from maintainer
    if (pkg.Maintainer) {
	pkg.Maintainer = pkg.Maintainer.replace(/\s*<[^>]*>\s*$/, '').
	    trim()
	    .replace(/^"/, '')
	    .replace(/"$/, '');
    }
    
    return pkg;
}

module.exports = clean_package;
