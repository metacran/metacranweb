
# METACRAN

> This is the Express application for the main METACRAN
> website at http://www.r-pkg.org

## Contributions

Yes, please! METACRAN is developed completely in the open.
All code and files are on GitHub at https://github.com/metacran.

Bug reports, code, design, ideas, any and all feedback
are welcome.

## Run it locally

Install docker and run:
```
docker compose build
docker compose up
```
then go to `http://localhost:3000` in your browser.

## Bits and pieces

Technology used in the app itself:

- [express.js](http://expressjs.com/)
- [ejs](https://github.com/mde/ejs) templates
- [request](https://github.com/request/request) for running queries
- [elasticsearch](https://github.com/elastic/elasticsearch-js)
  client to connect to the package search service

Plus several smaller packages, see [package.json](/package.json).

We connect to various database backends, via HTTP(S):
- [crandb](https://github.com/metacran/crandb) A CouchDB database of
  CRAN package metadata.
- [cranlogs](https://github.com/metacran/cranlogs.app) CRAN download
  data from the RStudio mirror. A PostgreSQL database with a HTTP API.

## License

MIT © 2015-2024 Gabor Csardi and contributors
