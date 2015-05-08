var express = require('express');
var router = express.Router();
var get_package = require('../lib/get_package');
var get_revdeps = require('../lib/get_revdeps');
var async = require('async');

re_full = new RegExp("^/([\\w\\.]+)$", 'i');

router.get(re_full, function(req, res) {
    var package = req.params[0];
    do_query(res, package);
})

function do_query(res, package) {

    async.parallel(
	{
	    'pkg': function(cb) {
		get_package(package, res, function(r) { cb(null, r)}) },
	    'revdeps': function(cb) {
		get_revdeps(package, res, function(r) { cb(null, r)}) }
	},
	function(err, results) {
	    results.pkg_link = function(x) {
		return '<a href="/pkg/' + x + '">' + x + '</a>';
	    };
	    res.render('package', results);
	}
    )
}

module.exports = router;
