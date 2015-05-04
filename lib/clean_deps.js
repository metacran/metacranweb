
function clean_deps(pkg) {

    function clean(field) {
	if (!field) return field;
	var deps = Object.keys(field);
	var index = deps.indexOf('R');
	if (index > -1) { deps.splice(index, 1); }
	deps = deps.map(function(x) {
	    return '<a href="/pkg/' + x + '">' + x + '</a>';
	})
	return deps.join(", ");
    }

    pkg.Imports   = clean(pkg.Imports);
    pkg.Depends   = clean(pkg.Depends);
    pkg.Suggests  = clean(pkg.Suggests);
    pkg.LinkingTo = clean(pkg.LinkingTo);
    pkg.Enhances  = clean(pkg.Enhances);

    console.log(pkg.Suggests);
    
    return pkg;
}

module.exports = clean_deps;
