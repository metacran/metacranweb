import ky from 'ky';
import get_packages from '../lib/get_packages.js';
import urls from '../lib/urls.js';

async function get_packages_by(maint) {
  const url = urls.crandb + '/-/maintainer?key=' +
	encodeURIComponent(JSON.stringify(maint))

  const pkgs = await ky.get(url).json();
  const pkgnames = pkgs.map(function(x) { return x[1]; });
  const pkgs2 = await get_packages(pkgnames);
  return pkgs2;
}

export default get_packages_by;
