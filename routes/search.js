var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

router.get("/search.html", function(req, res) {
    req.query.page = + req.query.page || 1;
    if (!!req.query['q']) {
	do_query(req, res);
    } else {
	show_empty(res);
    }
})

function do_query(req, res, query) {
    
    var client = new elasticsearch.Client({
	host: urls['seer']
    });

    client.search({
	index: 'cran-devel',
	type: 'package',
	from: ((req.query['page'] || 1) - 1) * 10,
	size: 10,
	"body": {
	    "query": {
		"function_score": {
		    "query": { "multi_match": {
			fields: ["Package^10", "Title^5", "Description^2",
				 "Author^3", "Maintainer^4", "_all" ],
			query: req.query['q'],
			operator: "and",
			"minimum_should_match": "20%"
		    } },
		    "functions": [
			{
			    "script_score": {
			    "script": "cran_search_score"
			    }
			}
		    ]
		}
	    }
	}
    }).then(function(resp) {
	show_results(resp, req, res);
    }, function(err) {
    });
}

function show_results(resp, req, res) {

    var hits = resp.hits.hits.map(function(x) {
	x._source = clean_package(x._source);
	return x;
    });
    var no_hits = resp.hits.total;
    var took = resp.took;
    var no_pages = Math.min(Math.ceil(no_hits / 10), 10);

    res.render('search', { 'q': req.query.q,
			   'page': req.query.page,
			   'no_hits': no_hits,
			   'took': took,
			   'hits': hits,
			   'no_pages': no_pages,
			   'pagetitle': 'METACRAN search results'
			 });
}

function show_empty(res) {
    res.redirect('/');
}

module.exports = router;
