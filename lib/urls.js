
var urls = {
    'crandb': 'https://crandb.r-pkg.org',
    'seer':   'https://search.r-pkg.org',
    'cranlogs': 'https://cranlogs.r-pkg.org',
    'github_raw': 'https://raw.githubusercontent.com/cran',
    'redis_host': process.env.REDIS_HOST || '127.0.0.1',
    'redis_port': process.env.REDIS_PORT || 6379
}

module.exports = urls;
