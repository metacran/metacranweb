
var urls = {
    'crandb': 'http://crandb2.r-pkg.org',
    'seer':   'seer.r-pkg.org:9200',
    'cranlogs': 'http://cranlogs.r-pkg.org',
    'docsdb': process.env.DOCSDB_URL || 'http://docs.r-pkg.org:5984',
    'redis_host': process.env.REDIS_HOST || '127.0.0.1',
    'redis_port': process.env.REDIS_PORT || 6379
}

module.exports = urls;
