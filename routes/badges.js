import express from 'express';
var router = express.Router();
import ky from 'ky';
import urls from '../lib/urls.js';
import moment from 'moment';

var svg_colors = {
    "brightgreen": "4c1",
    "green": "97CA00",
    "yellowgreen": "a4a61d",
    "yellow": "dfb317",
    "orange": "fe7d37",
    "red": "e05d44",
    "lightgrey": "9f9f9f",
    "blue": "007ec6"
};

var badge_svg = `/*
<svg xmlns="http://www.w3.org/2000/svg" width=":width:" height="20" aria-label=":text: :message:">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a">
    <rect width=":width:" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0h43v20H0z"/>
    <path fill=":color:" d="M43 0h:path_d:v20H43z"/>
    <path fill="url(#b)" d="M0 0h:width:v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle"
     font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="21.5" y="15" fill="#010101" fill-opacity=".3">
      :text:
    </text>
    <text x="21.5" y="14">
      :text:
    </text>
    <text x=":textwidth:" y="15" fill="#010101" fill-opacity=".3">
      :message:
    </text>
    <text x=":textwidth:" y="14">
      :message:
    </text>
  </g>
</svg>`

router.get("/", function(req, res) {
    res.render('underconstruction');
})

var re_pre = '^/(version|last-release|ago|version-ago|version-last-release)/';
var re_pkg = '([\\w\\.]+)';
var re_suf = '$';
var re_full = new RegExp(re_pre + re_pkg + re_suf, 'i');

router.get(re_full, function(req, res, next) {
    var type = req.params[0];
    var pkg = req.params[1];

    var now = new Date();
    var fivemin = new Date(now.getTime() + 5 * 60000).toUTCString();
    res.set('Content-Type', 'image/svg+xml');
    res.set('Expires', fivemin);
    res.set('Cache-Control', 'max-age=300, public');

    if (type == 'version') {
	return do_version_badge(res, next, pkg, req.query);
    } else {
	return do_lastrelease_badge(res, next, pkg, req.query, type);
    }

});

function do_version_badge(res, next, pkg, query) {

    var url = urls.crandb + '/-/desc?keys=["' + pkg + '"]';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    return next(error || response.statusCode);
	}
        try {
	    var pbody = JSON.parse(body);
	    var message = "not published";
	    if (pbody[pkg]) {
	        message = pbody[pkg]["version"] || "not published";
	    }
	    var svg = make_badge(res, "CRAN", message, query);

	    res.set(200);
	    res.send(svg);
        } catch(err) {
            return next(err);
        }
    });
}

function do_lastrelease_badge(res, next, pkg, query, type) {

    var url = urls.crandb + '/' + pkg;
    request(url, function(error, response, body) {
	if (error) {
	    return next(error || response.statusCode);
        }

        try {
	    if (response.statusCode == 404) {
	        svg = make_badge(res, 'CRAN', 'not published', query);

	    } else {
	        var json = JSON.parse(body);
	        var svg;
	        var d = new Date(json.date);
	        var now = new Date();
	        if (d > now) { d = now; }
	        var ver = json.Version;
	        var str = d.toISOString().slice(0, 10);
	        var ago = moment(d).fromNow();

	        if (type == 'last-release') {
		    svg = make_badge(res, 'CRAN', str, query);
	        } else if (type == 'ago') {
		    svg = make_badge(res, 'CRAN', ago, query);
	        } else if (type == 'version-ago') {
		    svg = make_badge(res, 'CRAN', ver + ' – ' + ago, query);
	        } else if (type == 'version-last-release') {
		    svg = make_badge(res, 'CRAN', ver + ' – ' + str, query);
	        }
            }

	    res.set(200);
	    res.send(svg);
        } catch(err) {
            return next(err);
        }
    });
}

function make_badge(res, text, message, query) {

    var def_color = "brightgreen";
    if (message == "not published") { def_color = "red" }
    var color = query['color'] || def_color;
    color = svg_colors[color] || color;

    var len = message.length;
    var no_dots = (message.match(/\./g) || []).length
    if (message == "not published") {
	var width = 53 + 6 * len;
	var textwidth = 47 + 3 * len;
	var path_d = 36 + 6 * len;
    } else {
	var width = 61 + 6 * len - 3 * no_dots;
	var textwidth = 51 + 3 * len - 1.5 * no_dots;
	var path_d = 36 + 6 * len - 1.5 * no_dots;
    }

    svg = badge_svg
        .replace(/:text:/g, text)
	.replace(/:color:/g, '#' + color.replace(/[^\w]/g, ''))
	.replace(/:width:/g, width)
	.replace(/:textwidth:/g, textwidth)
	.replace(/:path_d:/g, path_d)
	.replace(/:message:/g, message)

    return svg;
}

export default router;
