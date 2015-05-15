
var urls = {
    'crandb': 'http://crandb.r-pkg.org',
    'seer':   'seer.r-pkg.org:9200',
    'cranlogs': 'http://cranlogs.r-pkg.org',
    'docsdb': process.env.DOCSDB_URL || 'http://127.0.0.1:5984'
}

module.exports = urls;
