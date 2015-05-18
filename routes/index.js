var express = require('express');
var router = express.Router();
var top_downloaded = require('../lib/top_downloaded');
var trending = require('../lib/trending');
var recent = require('../lib/recent');
var num_active = require('../lib/num_active');
var num_maint = require('../lib/num_maint');
var num_downloads = require('../lib/num_downloads');
var num_updates = require('../lib/num_updates');
var async = require('async');
var handle_error = require('../lib/handle_error');

router.get('/', function(req, res) {

    async.parallel(
	{ 'numactive': function(cb) {
	    num_active(function(e, r) { cb(e, r) }) },
	  'nummaint': function(cb) {
	    num_maint(function(e, r) { cb(e, r) }) },
	  'numupdates': function(cb) {
	    num_updates(function(e, r) { cb(e, r) }) },
	  'numdownloads': function(cb) {
	    num_downloads(function(e, r) { cb(e, r) }) },
	  'downloads': function(cb) {
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

router.get('/about', function(req, res) {
    res.render('about');
})

router.get('/api', function(req, res) {
    res.render('underconstruction');
})    

module.exports = router;
