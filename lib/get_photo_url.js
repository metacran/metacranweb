import gravatar from 'gravatar';

function get_photo_url(maint, callback) {
    var url = gravatar.url(maint, { 's': '380', 'd': 'mm' }, false);
    callback(null, url);
}

export default get_photo_url;
