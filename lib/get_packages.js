import ky from 'ky';
import urls from '../lib/urls.js';
import clean_package from '../lib/clean_package.js';

async function get_packages(pkgnames) {
  const pkgnames2 = pkgnames.map(function(x) { return '"' + x + '"'; });
  const url2 = urls.crandb + '/-/versions?keys=[' + pkgnames2.join(',') + ']';
  const pkgs = await ky.get(url2).json();
  const pkg_array = Object.values(pkgs).map(clean_package);
  return pkg_array;
}

export default get_packages;
