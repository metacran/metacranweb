
// TODO: should we do this during preprocessing?
function tv_linkify(tv) {

    tv.info = do_replace(tv.info);
    tv.links = tv.links.map(do_replace2);
    
    return tv;
}

function do_replace(entry) {
    return entry.replace(/<pkg>(.*?)<\/pkg>/g, '<a href="/pkg/$1">$1</a>')
	.replace(/<view>(.*?)<\/view>/g, '<a href="/ctv/$1">$1</a>')
	.replace(/<bioc>(.*?)<\/bioc>/g,
		 '<a href="http://bioconductor.org/packages/release/bioc/html/$1.html">$1</a>')
	.replace(/<ohat>(.*?)<\/ohat>/g,
		 '<a href="http://www.omegahat.org/$1">$1</a>')
	.replace(/<rforge>(.*?)<\/rforge>/g,
		 '<a href="https://r-forge.r-project.org/projects/$1">$1</a>')
	.replace(/<gcode>(.*?)<\/gcode>/g,
		 '<a href="https://code.google.com/p/$1">$1</a>');
}

function do_replace2(entry) {
    return entry
	.replace(/<view>(.*?)<\/view>/g, 'Task view: <a href="/ctv/$1">$1</a>')
	.replace(/<bioc>(.*?)<\/bioc>/g,
		 'Bioconductor package: <a href="http://bioconductor.org/packages/release/bioc/html/$1.html">$1</a>')
	.replace(/<ohat>(.*?)<\/ohat>/g,
		 'Omegahat package: <a href="http://www.omegahat.org/$1">$1</a>')
	.replace(/<rforge>(.*?)<\/rforge>/g,
		 'R-Forget project: <a href="https://r-forge.r-project.org/projects/$1">$1</a>')
	.replace(/<gcode>(.*?)<\/gcode>/g,
		 'Google Code project: <a href="https://code.google.com/p/$1">$1</a>');
}

module.exports = tv_linkify;
