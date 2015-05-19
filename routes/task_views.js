var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var handle_error = require('../lib/handle_error');
var tv_linkify = require('../lib/tv_linkify');
var get_packages = require('../lib/get_packages');

// List of task views

router.get('/', function(req, res) {
    var url = urls.docsdb + '/task-view/_all_docs?include_docs=true';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	var tv = JSON.parse(body)
	    .rows
	    .map(function(x) { return x.doc.html; });
	res.render('task_view_list', { 'task_views': tv,
				       'pagetitle': 'METACRAN task views' });
    })
})

// A single task view

var re_full = new RegExp('^/(.*)$');
router.get(re_full, function(req, res) {
    var tv = req.params[0];
    var url = urls.docsdb + '/task-view/' + tv;
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	var tv = tv_linkify(JSON.parse(body).html);
	get_packages(tv.packagelist, function(error, pkgs) {
	    if (error) { return handle_error(res); }
	    res.render('task_view', { 'task_view': tv,
				      'title': false,
				      'pkgs': pkgs,
				      'pagetitle': 'METACRAN task views' });
	})
    })
})

module.exports = router;
