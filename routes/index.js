var express = require('express');
var router = express.Router();
var top_downloaded = require('../lib/top_downloaded');
var trending = require('../lib/trending');
var recent = require('../lib/recent');
var async = require('async');

router.get('/', function(req, res) {

    async.parallel(
	{ 'downloads': function(cb) {
	    top_downloaded(function(res) { cb(null, res) }) },
	  'trending':  function(cb) {
	    trending(function(res) { cb(null, res) }) },
	  'recent':    function(cb) {
	    recent(function(res) { cb(null, res) }) }
	},
	function(err, results) {
	    res.render('index', results);
	}
    )
});

module.exports = router;
