var express = require('express');
var request = require('request');
var router = express.Router();
var urls = require('../lib/urls');
var clean_package = require('../lib/clean_package');

router.get("/search.html", function (req, res, next) {
	req.query.page = + req.query.page || 1;
	if (!!req.query['q']) {
		do_query(req, res, next);
	} else {
		show_empty(res, next);
	}
})

function do_query(req, res, next) {

	const url = urls["seer"] + '/package/_search';

	var fields = ["Package^10", "Title^5", "Description^2",
		"Author^3", "Maintainer^4", "_all"];

	const body = {
		"from": (req.query.page - 1) * 10,
		"size": 10,
		"query": {
			"function_score": {
				"functions": [
					{
						"field_value_factor": {
							"field": "revdeps",
							"modifier": "sqrt",
							"factor": 1
						}
					}
				],
				"query": {
					"bool": {
						"must": [
							{
								"multi_match": {
									"query": req.query['q'],
									"type": "most_fields"
								}
							}
						],
						"should": [
							{
								"multi_match": {
									"query": req.query['q'],
									"fields": ["Title^10", "Description^2", "_all"],
									"type": "phrase",
									"analyzer": "english_and_synonyms",
									"boost": 10
								}
							},
							{
								"multi_match": {
									"query": req.query['q'],
									"fields": ["Package^20", "Title^10", "Description^2", "Author^5", "Maintainer^6", "_all"],
									"operator": "and",
									"analyzer": "english_and_synonyms",
									"boost": 5
								}
							}
						]
					}
				}
			}
		}
	};

	request.post(
		{ url: url, method: 'POST', json: true, body: body },
		function (error, response, body) {
			if (error) {
				next(error);
			} else {
				show_results(response.body, req, res);
			}
		})
}

// Errors here will be caught by the promise, and forwarded to next()

function show_results(resp, req, res) {
        var hits;
        if (resp.hits) {
	        hits = resp.hits.hits.map(function (x) {
		        x._source = clean_package(x._source);
		    return x;
		});
	} else {
	        hits = [];
	}
	var no_hits = resp.hits.total;
	var took = resp.took;
	var no_pages = Math.min(Math.ceil(no_hits / 10), 10);

	res.render('search', {
		'q': req.query.q,
		'page': req.query.page,
		'no_hits': no_hits,
		'took': took,
		'hits': hits,
		'no_pages': no_pages,
		'pagetitle': 'METACRAN search results'
	});
}

function show_empty(res, next) {
	res.redirect('/');
}

module.exports = router;
