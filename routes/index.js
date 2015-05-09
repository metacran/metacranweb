var express = require('express');
var router = express.Router();
var top_downloaded = require('../lib/top_downloaded');
var trending = require('../lib/trending');
var recent = require('../lib/recent');
var async = require('async');
var handle_error = require('../lib/handle_error');

router.get('/', function(req, res) {

    async.parallel(
	{ 'downloads': function(cb) {
	    top_downloaded(function(e, r) { cb(e, r) }) },
	  'trending': function(cb) {
	    trending(function(e, r) { cb(e, r) }) },
	  'recent': function(cb) {
	    recent(function(e, r) { cb(e, r) }) }
	},
	function(err, results) {
	    if (err) { return handle_error(res, err); }
	    res.render('index', results);
	}
    )
});

module.exports = router;
