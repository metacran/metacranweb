import assert from 'assert'
import mocha from 'mocha'

import * as td from 'testdouble'

mocha.describe('num_updates cache hit', function () {
  mocha.beforeEach(async function () {
    await td.replaceEsm(
      '../lib/cache.js',
      undefined,
      async function (_key, cleanup, _refresh) {
        return cleanup("1235");
      })
    this.subject = await import('../lib/num_updates.js');
  })

  mocha.afterEach(function () {
    td.reset()
  })

  mocha.it('cache hit', async function () {
    const na = await this.subject.default();
    assert.equal(na, '1,235');
  });
});

mocha.describe('num_updates cache miss + refresh', function () {
  if (process.env.METACRAN_LIVE_TESTS != 'true') {
    return;
  }
  mocha.beforeEach(async function () {
    await td.replaceEsm(
      '../lib/cache.js',
      undefined,
      async function (key, cleanup, refresh) {
        const val = await refresh(key);
        return cleanup(val);
      })
    this.subject = await import('../lib/num_updates.js');
  })

  mocha.afterEach(function () {
    td.reset()
  })

  mocha.it('cache miss', async function () {
    const na = await this.subject.default();
    assert.match(na, /^[0-9]+,?[0-9]*$/);
  });
});
