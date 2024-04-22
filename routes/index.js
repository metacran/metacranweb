import express from 'express';
var router = express.Router();
import top_downloaded from '../lib/top_downloaded.js';
import top_revdeps from '../lib/top_revdeps.js';
import trending from '../lib/trending.js';
import recent from '../lib/recent.js';
import num_active from '../lib/num_active.js';
import num_maint from '../lib/num_maint.js';
import num_downloads from '../lib/num_downloads.js';
import num_updates from '../lib/num_updates.js';

router.get('/', async function (req, res, next) {
	try {
		const na = num_active();
		const nm = num_maint();
		const nu = num_updates();
		const nd = num_downloads();
		const td = top_downloaded();
		const tr = trending();
		const re = recent();
		const rv = top_revdeps();
		const all = await Promise.all([na, nm, nu, nd, td, tr, re, rv]);
		const results = {
			numactive:    all[0],
			nummaint:     all[1],
			numupdates:   all[2],
			numdownloads: all[3],
			downloads:    all[4],
			trending:     all[5],
			recent:       all[6],
			toprevdeps:   all[7]
		};
		res.render('index', results);
	} catch (err) {
		next(err);
	}
});

router.get('/about', function (req, res) {
	res.render('about', { 'pagetitle': 'About METACRAN' });
})

router.get('/services', function (req, res) {
	res.render('services', { 'pagetitle': 'METACRAN services' });
})

export default router;
