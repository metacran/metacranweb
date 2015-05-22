var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var get_maint = require('../lib/get_maint');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');
var pkg_link = require('../lib/pkg_link');
var get_packages_by = require('../lib/get_packages_by');
var get_photo_url = require('../lib/get_photo_url');
var get_gh_username = require('../lib/get_gh_username');

router.get('/', function(req, res) {
    var startkey = req.query.startkey || '';
    var url = urls.crandb +
	'/-/maintainernames?group_level=2&limit=100&startkey=["' +
	startkey + '"]';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	var pp = JSON.parse(body)
	    .map(function(x) { return { 'name': x[0][0],
					'email': x[0][1],
					'num_pkgs': x[1] }; });
	var keys = pp.map(function(x) {
	    return '"' + encodeURIComponent(x.email) + '"'; }).join(',');
	var url2 = urls.crandb + '/-/maintainer?keys=[' + keys + ']';

	request(url2, function(error, response, body) {
	    if (error || response.statusCode != 200) {
		return handle_error(res);
	    }
	    var packages = {};
	    JSON.parse(body).map(function(x) {
		var email = x[0];
		var package = x[1];
		if (!packages[email]) { packages[email] = []; }
		if (packages[email].indexOf(package) < 0) {
		    packages[email].push(package);
		}
	    })
	    res.render('maint', { 'people': pp,
				  'packages': packages,
				  'pkg_link': pkg_link,
				  'pagetitle': 'METACRAN maintainers' });
	})
    });
})

re_full = new RegExp("^/(.+)$");
router.get(re_full, function(req, res) {

    var maint = req.params[0];

    async.parallel(
	{
	    'pkgs': function(cb) {
		get_packages_by(maint, function(e, r) { cb(e, r)}) },
	    'photo': function(cb) {
		get_photo_url(maint, function(e, r) { cb(e, r)}) },
	    'ghuser': function(cb) {
		get_gh_username(maint, function(e, r) { cb(e, r)}) }
	},
	function(err, results) {

	    if (err) { return handle_error(res, err); }

	    results.email = maint;
	    results.title = 'Packages by ' + results.pkgs[0].Maintainer;
	    results.paging = false;
	    results.number = false;
	    results.pagetitle = 'METACRAN maintainers';
	    results.npr = 3;
	    results.cw = "col-md-4";
	    
	    res.render('maint1', results);
	}
    )
})

module.exports = router;
