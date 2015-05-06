var express = require('express');
var router = express.Router();
var request = require('request');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');
var clean_deps = require('../lib/clean_deps');
var handle_error = require('../lib/handle_error');

re_full = new RegExp("^/([\\w\\.]+)$", 'i');

router.get(re_full, function(req, res) {
    var package = req.params[0];
    do_query(res, package);
})

function do_query(res, package) {

    var url = urls.crandb + '/' + package;
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	show_result(res, JSON.parse(body));
    });
}

function show_result(res, result) {
    var pkg = clean_deps(clean_package(result));
    res.render('package', { "pkg": pkg });
}

module.exports = router;
