import express from 'express';
import ky from 'ky';
var router = express.Router();
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

router.get("/search.html", async function (req, res, next) {
	try {
		req.query.page = + req.query.page || 1;
		if (!!req.query['q']) {
			await do_query(req, res);
		} else {
			show_empty(res, next);
		}
	} catch (err) {
		next(err);
	}
})

async function do_query(req, res) {
	const url = urls["seer"] + '/package/_search?size=10&from=' +
		((req.query['page'] || 1) - 1) * 10;
	const fields = ["Package^10", "Title^5", "Description^2",
		"Author^3", "Maintainer^4", "_all"];
	const body = {
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

	const hits = await ky.post(url, { json: body }).json();
  show_results(hits, req, res);
}

function show_results(resp, req, res) {
	const hits = resp.hits.hits.map(function (x) {
		x._source = clean_package(x._source);
		return x;
	});
	const no_hits = resp.hits.total;
	const took = resp.took;
	const no_pages = Math.min(Math.ceil(no_hits / 10), 10);

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

export default router;
