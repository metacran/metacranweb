var express = require('express');
var router = express.Router();
var get_stats = require('../lib/get_stats');
var top_downloaded = require('../lib/top_downloaded');
var trending = require('../lib/trending');
var recent = require('../lib/recent');

router.get('/', function(req, res) {

    top_downloaded(function(cb1) {
	trending(function(cb2) {
	    recent(function(cb3) {

		res.render('index', { 'downloads': cb1,
				      'trending': cb2,
				      'recent': cb3
				    });
	    })
	})
    });

});

module.exports = router;
