import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes

import routes from './routes/index.js';
import badges from './routes/badges.js';
import search from './routes/search.js';
import pkg from './routes/pkg.js';
import pkglist from './routes/pkglist.js';
import trendinglist from './routes/trendinglist.js';
import downloadlist from './routes/downloadlist.js';
import mostrecent from './routes/mostrecent.js';
import depended from './routes/depended.js';
import maint from './routes/maint.js';
import dokkucheck from './routes/check.js';

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
    console.log('Development error handler activated, will print stacktraces in error messages.')
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

export default app;
