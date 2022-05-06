
var urls = {
    'crandb': 'http://crandb.r-pkg.org',
    'seer':   'search.r-pkg.org',
    'cranlogs': 'http://cranlogs.r-pkg.org',
    'redis_host': process.env.REDIS_HOST || '127.0.0.1',
    'redis_port': process.env.REDIS_PORT || 6379
}

module.exports = urls;
