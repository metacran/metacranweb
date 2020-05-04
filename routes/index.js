var express = require('express');
var router = express.Router();
var top_starred = require('../lib/top_starred');
var top_downloaded = require('../lib/top_downloaded');
var top_revdeps = require('../lib/top_revdeps');
var trending = require('../lib/trending');
var recent = require('../lib/recent');
var num_active = require('../lib/num_active');
var num_maint = require('../lib/num_maint');
var num_downloads = require('../lib/num_downloads');
var num_updates = require('../lib/num_updates');
var async = require('async');

router.get('/', function(req, res, next) {

    async.parallel(
	{ 'numactive': function(cb) {
	    num_active(function(e, r) { cb(e, r) }) },
	  'nummaint': function(cb) {
	    num_maint(function(e, r) { cb(e, r) }) },
	  'numupdates': function(cb) {
	    num_updates(function(e, r) { cb(e, r) }) },
	  'numdownloads': function(cb) {
	    num_downloads(function(e, r) { cb(e, r) }) },
	  'stars': function(cb) {
	    top_starred(function(e, r) { cb(e, r) }) },
	  'downloads': function(cb) {
	    top_downloaded(function(e, r) { cb(e, r) }) },
	  'trending': function(cb) {
	    trending(function(e, r) { cb(e, r) }) },
	  'recent': function(cb) {
	    recent(function(e, r) { cb(e, r) }) },
	  'toprevdeps': function(cb) {
	    top_revdeps(function(e, r) { cb(e, r) }) }
	},
	function(err, results) {
	    if (err) { return next(err); }
	    try {
                res.render('index', results);
            } catch {
                next(new Error("Cannot render index :("));
            }
	}
    )
});

router.get('/about', function(req, res) {
    res.render('about', { 'pagetitle': 'About METACRAN' });
})

router.get('/services', function(req, res) {
    res.render('services', { 'pagetitle': 'METACRAN services' });
})    

module.exports = router;
