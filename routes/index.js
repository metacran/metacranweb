var express = require('express');
var router = express.Router();
var top_downloaded = require('../lib/top_downloaded');
var trending = require('../lib/trending');
var recent = require('../lib/recent');
var async = require('async');

router.get('/', function(req, res) {

    async.parallel(
	{ 'downloads': function(cb) {
	    top_downloaded(res, function(r) { cb(null, r) }) },
	  'trending': function(cb) {
	    trending(res, function(r) { cb(null, r) }) },
	  'recent': function(cb) {
	    recent(res, function(r) { cb(null, r) }) }
	},
	function(err, results) {
	    res.render('index', results);
	}
    )
});

module.exports = router;
