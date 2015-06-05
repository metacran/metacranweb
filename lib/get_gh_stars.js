var request = require('request');
var urls = require('../lib/urls');


function get_gh_stars(package, callback) {
    var url = urls.docsdb + '/gh-stars/' + package;
    console.log(url)
    request(url, function(error, response, body) {
	if (error || response.statusCode != 200) {
	    callback(null, undefined);
	    return;
	}
	callback(null, JSON.parse(body).stars);
    })
}

module.exports = get_gh_stars;
