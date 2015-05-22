var gravatar = require('gravatar');

function get_photo_url(maint, callback) {
    var url = gravatar.url(maint, { 's': '320', 'd': 'mm' }, false);
    callback(null, url);
}

module.exports = get_photo_url;
