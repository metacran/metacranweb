var request = require('request');
var urls = require('../lib/urls');
var comma = require('comma-numbers')();

function num_active(callback) {

    var url = urls.crandb + '/-/numactive';
    request(url, function(error, response, body) {
	if (error) { return callback(error, undefined); }
	callback(error, comma(JSON.parse(body)));
    });
}

module.exports = num_active;
