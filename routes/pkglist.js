var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');
var clean_package = require('../lib/clean_package');

var re_full = new RegExp('^/([\\w\\.]+)?$')

router.get(re_full, function(req, res) {
    var from = req.params[0];
    do_query(res, from, req.query);
})

function do_query(res, from, query) {
    var startkey = query.startkey || from || '';
    var url = urls.crandb + '/-/latest?limit=100&startkey="' +
	startkey + '"';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return handle_error(res, error || response.statusCode);
	}
	var pkgs = JSON.parse(body);
	for (p in pkgs) { pkgs[p] = clean_package(pkgs[p]); }
	res.render('pkglist', { 'pkgs': pkgs,
				'title': 'All packages',
				'paging': true,
				'number': false
			      });
    })
}

module.exports = router;
