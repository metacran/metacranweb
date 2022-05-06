var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('web');

// Routes

var routes = require('./routes/index');
var badges = require('./routes/badges');
var search = require('./routes/search');
var pkg = require('./routes/pkg');
var pkglist = require('./routes/pkglist');
var trendinglist = require('./routes/trendinglist');
var downloadlist = require('./routes/downloadlist');
var mostrecent = require('./routes/mostrecent');
var depended = require('./routes/depended');
var maint = require('./routes/maint');
var dokkucheck = require('./routes/check');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nCrawl-delay: 10\n");
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/recent', mostrecent);
app.use('/trending', trendinglist);
app.use('/downloaded', downloadlist);
app.use('/depended', depended);
app.use('/badges', badges);
app.use('/pkglist', pkglist);
app.use('/pkg', pkg);
app.use('/maint', maint);
app.use('/', search);
app.use('/', routes);
app.use('/check', dokkucheck);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    debug('Development error handler activated, will print stacktraces in error messages.')
    app.use(function(err, req, res, next) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        console.log(err)
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
