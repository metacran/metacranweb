
# METACRAN

> This is the Express application for the main METACRAN
> website at http://www.r-pkg.org

## Contributions

Yes, please! METACRAN is developed completely in the open.
All code and files are on GitHub at https://github.com/metacran.

Bug reports, code, design, ideas, any and all feedback
are welcome.

## Run it locally

1. Install [node.js](https://nodejs.org/).
   [io.js](https://iojs.org/en/index.html) might work, too, although
   it is currently not tested.
2. Clone the repo, install needed npm packages:
   
    ```
    git clone https://github.com/metacran/metacranweb
	cd metacranweb
	npm install
	```

3. Start the app:

    ```
    PORT=3000 bin/www
	```

4. Go to `http://localhost:3000` in your browser.

Tips:
- Use [supervisor](https://github.com/isaacs/node-supervisor) or
  a similar program to watch for changes.
- Set the `GH_TOKEN` environment variable to your
  [personal GitHub access token](https://github.com/settings/tokens/new)
  to avoid the
  [GitHub API rate limits](https://developer.github.com/v3/rate_limit/).

## Bits and pieces

Technology used in the app itself:

- [express.js](http://expressjs.com/)
- [ejs](http://www.embeddedjs.com/) templates
- [request](https://github.com/request/request) for running queries
- [elasticsearch](https://github.com/elastic/elasticsearch-js)
  client to connect to the package search service

Plus several smaller packages, see [package.json](/package.json).

We connect to various database backends, via HTTP(S):
- [crandb](https://github.com/metacran/crandb) A CouchDB database of
  CRAN package metadata.
- [cranlogs](https://github.com/metacran/cranlogs.app) CRAN download
  data from the RStudio mirror. A PostgreSQL database with a HTTP API.
- [seer](https://github.com/metacran/seer) An elasticsearch database of
  CRAN package metadata.
- [docs](http://docs.r-pkg.org:5984/) A  CouchDB database of various
  CRAN package documentation: READMEs, NEWS files, CRAN Task Views, etc.
  This does not have a public API.

## License

MIT © 2015 Gabor Csardi and contributors
