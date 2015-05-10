var request = require('request');
var urls = require('../lib/urls');
var comma = require('comma-numbers')();

function num_updates(callback) {

    var tmpd = new Date();
    tmpd.setDate(tmpd.getDate() - 7);
    var weekago = tmpd.toISOString();
    var url = urls.crandb + '/-/numpkgreleases?start_key="' + weekago + '"';
    console.log(url)
    request(url, function(error, response, body) {
	if (error) { return callback(error, undefined); }
	callback(error, comma(JSON.parse(body)));
    });
}

module.exports = num_updates;
