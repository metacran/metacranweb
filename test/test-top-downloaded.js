import assert from 'assert'
import mocha from 'mocha'

import * as td from 'testdouble'

mocha.describe('top_downloaded cache hit', function () {
  mocha.beforeEach(async function () {
    await td.replaceEsm(
      '../lib/cache.js',
      undefined,
      async function (_key, _cleanup, _refresh) {
        return [ { Package: "foo" }, { Package: "bar" } ];
      })
    this.subject = await import('../lib/top_downloaded.js');
  })

  mocha.afterEach(function () {
    td.reset()
  })

  mocha.it('cache hit', async function () {
    const na = await this.subject.default();
    assert.equal(na[0].Package, 'foo');
    assert.equal(na[1].Package, 'bar');
  });
});

mocha.describe('top_downloaded cache miss + refresh', function () {
  if (process.env.METACRAN_LIVE_TESTS != 'true') {
    return;
  }
  mocha.beforeEach(async function () {
    await td.replaceEsm(
      '../lib/cache.js',
      undefined,
      async function (key, _cleanup, refresh) {
        const val = await refresh(key);
        return val;
      })
    this.subject = await import('../lib/top_downloaded.js');
  })

  mocha.afterEach(function () {
    td.reset()
  })

  mocha.it('cache miss', async function () {
    const na = await this.subject.default();
    assert.ok(na[0].Package);
  });
});
