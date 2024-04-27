import gravatar from 'gravatar';

async function get_photo_url(maint) {
  const url = gravatar.url(maint, { 's': '380', 'd': 'mm' }, false);
  return url;
}

export default get_photo_url;
