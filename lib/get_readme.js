var request = require('request');
var url = require('url');
var markdownit = require('markdown-it');
var sanitize = require('sanitize-html');
var client = require('../lib/cache').client;
var urls = require('../lib/urls');

var md = markdownit({ html: true, linkify: true });

// How long to wait before we try again, if this version of the
// package is not on GitHub yet
var miss_expiry = 60 * 60;

// Limits for downloading and formatting the README. If we hit them,
// the page is shown without a README.
var request_timeout = 5 * 1000;
var total_timeout = 10 * 1000;
var max_size = 1024 * 1024;

// Rewrite relative links, so they point to the GitHub mirror
function absolute(link, base) {
    if (!link || link[0] == '#' || link.match(/^([a-z][a-z0-9+.-]*:|\/\/)/i)) {
	return link;
    }
    return url.resolve(base, link.replace(/^\/+/, ''));
}

function rewrite(base) {
    return function(tagName, attribs) {
	if (tagName == 'img') { attribs.src = absolute(attribs.src, base); }
	if (tagName == 'a') { attribs.href = absolute(attribs.href, base); }
	return { tagName: tagName, attribs: attribs };
    };
}

function render_md(package, version, text) {
    var raw_base = urls.github_raw + '/' + package + '/' + version + '/';
    var blob_base = 'https://github.com/cran/' + package + '/blob/' +
	version + '/';

    return sanitize(md.render(text), {
	allowedTags: sanitize.defaults.allowedTags.concat([
	    'img', 'h1', 'h2', 'del', 's', 'sup', 'sub', 'span',
	    'details', 'summary'
	]),
	allowedAttributes: {
	    a: [ 'href', 'name', 'title' ],
	    img: [ 'src', 'alt', 'title', 'width', 'height', 'align' ],
	    p: [ 'align' ],
	    div: [ 'align' ],
	    h1: [ 'align' ],
	    h2: [ 'align' ],
	    h3: [ 'align' ],
	    th: [ 'style', 'align' ],
	    td: [ 'style', 'align' ]
	},
	allowedStyles: {
	    th: { 'text-align': [ /^(left|right|center)$/ ] },
	    td: { 'text-align': [ /^(left|right|center)$/ ] }
	},
	transformTags: {
	    img: rewrite(raw_base),
	    a: rewrite(blob_base)
	}
    });
}

function render_txt(text) {
    return '<pre>' + md.utils.escapeHtml(text) + '</pre>';
}

// Get a file from the GitHub mirror. Calls back with the contents,
// or null if the file does not exist.
function get_file(package, version, file, callback) {
    var file_url = urls.github_raw + '/' + package + '/' + version + '/' +
	file;
    var opts = { url: file_url, timeout: request_timeout };
    request(opts, function(error, response, body) {
	if (error) { return callback(error); }
	if (response.statusCode == 404) { return callback(null, null); }
	if (response.statusCode != 200) {
	    return callback(new Error('Cannot get ' + file_url + ': HTTP ' +
				      response.statusCode));
	}
	if (body.length > max_size) {
	    return callback(new Error(file_url + ' is too large'));
	}
	callback(null, body);
    });
}

function render(callback, fn) {
    try {
	var html = fn();
    } catch(err) {
	return callback(err);
    }
    callback(null, html);
}

// Calls back with the HTML of the README, '' if the package has no
// README, or null if this version is not on GitHub (yet).
function fetch_readme(package, version, callback) {
    get_file(package, version, 'README.md', function(err, text) {
	if (err) { return callback(err); }
	if (text !== null) {
	    return render(callback, function() {
		return render_md(package, version, text);
	    });
	}
	get_file(package, version, 'README', function(err, text) {
	    if (err) { return callback(err); }
	    if (text !== null) {
		return render(callback, function() { return render_txt(text); });
	    }
	    get_file(package, version, 'DESCRIPTION', function(err, text) {
		if (err) { return callback(err); }
		callback(null, text === null ? null : '');
	    });
	});
    });
}

// The rendered README is cached forever, but only for the current
// version: `readme:<package>` holds the version and the HTML.
// If the current version is not on GitHub yet, we show the README
// of the previous version, if we have it.
//
// get_readme never fails: on any error it logs it and calls back with
// an empty (or old) README, exactly once. Errors are not cached, so we
// try again on the next page view.

function get_readme(package, version, callback) {
    var old = '';
    var done = false;
    function finish(err, html) {
	if (done) { return; }
	done = true;
	clearTimeout(timer);
	if (err) {
	    console.error('README error for ' + package + ' ' + version +
			  ': ' + (err.message || err));
	    html = old;
	}
	try {
	    callback(null, html);
	} catch(err) {
	    console.error('README callback error: ' + err);
	}
    }
    var timer = setTimeout(function() {
	finish(new Error('timeout'));
    }, total_timeout);

    try {
	lookup(package, version, function(o) { old = o; }, finish);
    } catch(err) {
	finish(err);
    }
}

function lookup(package, version, set_old, callback) {
    var key = 'readme:' + package;
    var miss_key = 'readme-miss:' + package + ':' + version;

    client.get(key, function(err, value) {
	var cached = null;
	try {
	    if (!err && value !== null) { cached = JSON.parse(value); }
	} catch(err) {
	    cached = null;
	}
	if (cached && cached.version === version) {
	    return callback(null, cached.html);
	}
	var old = cached ? cached.html : '';
	set_old(old);

	client.get(miss_key, function(err, miss) {
	    if (!err && miss !== null) { return callback(null, old); }

	    fetch_readme(package, version, function(err, html) {
		if (err) { return callback(err); }
		if (html === null) {
		    client.set(miss_key, '1', 'EX', miss_expiry);
		    return callback(null, old);
		}
		client.set(key, JSON.stringify({ version: version, html: html }));
		callback(null, html);
	    });
	});
    });
}

module.exports = get_readme;
