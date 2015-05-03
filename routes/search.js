var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var moment = require('moment');
var urls = require('../lib/urls');
var linkify = require('../lib/linkify');

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
			query: req.query['q'] } },
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

    var hits = clean_hits(resp.hits.hits);
    var no_hits = resp.hits.total;
    var took = resp.took;
    var no_pages = Math.min(Math.ceil(no_hits / 10), 10);

    res.render('search', { 'q': req.query.q,
			   'page': req.query.page,
			   'no_hits': no_hits,
			   'took': took,
			   'hits': hits,
			   'no_pages': no_pages   });
}

function clean_hits(hits) {
    return hits.map(function(hit) {

	// Linkify URL
	if (hit._source.URL) {
	    hit._source.URL = linkify(hit._source.URL);
	}
	// Remove newlines from title
	if (hit._source.Title) {
	    hit._source.Title =
		hit._source.Title.replace(/<U\+000a>/g, ' ');
	}
	// Remove newlines from description, also linkify
	if (hit._source.Description) {
	    hit._source.Description =
		linkify(hit._source.Description.replace(/<U\+000a>/g, ' '));
	}
	// Use 'time ago' instead of date
	if (hit._source.date) {
	    hit._source.timeago = moment(hit._source.date).fromNow();
	}
	// Remove email address from maintainer
	if (hit._source.Maintainer) {
	    hit._source.Maintainer =
		hit._source.Maintainer.replace(/\s*<[^>]*>\s*$/, '');
	}

	return hit;
    })
}

function show_empty(res) {
    res.redirect('/');
}

module.exports = router;
