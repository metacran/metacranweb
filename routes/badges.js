var express = require('express');
var router = express.Router();
var multiline = require('multiline');
var request = require('request');

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

var badge_svg = multiline(function(){/*
<svg xmlns="http://www.w3.org/2000/svg" width=":width:" height="20">
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
      CRAN
    </text>
    <text x="21.5" y="14">
      CRAN
    </text>
    <text x=":textwidth:" y="15" fill="#010101" fill-opacity=".3">
      :message:
    </text>
    <text x=":textwidth:" y="14">
      :message:
    </text>
  </g>
</svg>
*/});

var re_pre = '^/version/';
var re_pkg = '([\\w\\.]+)';
var re_suf = '$';
var re_full = new RegExp(re_pre + re_pkg + re_suf, 'i');

router.get(re_full, function(req, res) {
    var package = req.params[0];
    do_query(res, package, req.query);
});

function do_query(res, package, query) {

    var now = new Date().toUTCString();
    res.set('Content-Type', 'image/svg+xml');
    res.set('Expires', now);
    res.set('Cache-Control', 'no-cache');

    var url = 'http://crandb.r-pkg.org/-/desc?keys=["' + package + '"]';
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) { return handle_error(res); }
	var pbody = JSON.parse(body);
	var message = "not published";
	if (pbody[package]) {
	    message = pbody[package]["version"] || "not published";
	}
	var svg = make_badge(res, message, query);

	res.set(200);
	res.send(svg);
	res.end();
    });
}

function make_badge(res, message, query) {

    var len = message.length;
    var no_dots = (message.match(/\./g) || []).length
    var color = query['color'] || 'red';
    color = svg_colors[color] || color;
    var width = 53 + 7 * len - 3 * no_dots;
    var textwidth = 47 + 3.5 * len - 1.5 * no_dots;
    var path_d = 36 + 7 * len - 3 * no_dots;

    console.log(no_dots);

    svg = badge_svg
	.replace(/:color:/g, '#' + color.replace(/[^\w]/g, ''))
	.replace(/:width:/g, width)
	.replace(/:textwidth:/g, textwidth)
	.replace(/:path_d:/g, path_d)
	.replace(/:message:/g, message)

    return svg;
}

module.exports = router;
