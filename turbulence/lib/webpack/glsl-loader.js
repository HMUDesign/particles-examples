const loaderUtils = require('loader-utils');

let regex_include = /#include (<|")(.+?)("|>)/;

module.exports = function(contents) {
	this.cacheable();

	contents = contents
		.replace( /\r\n/g, '\n' ) // # \r\n to \n
		.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
		.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
		.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
	;

	const query = loaderUtils.getOptions(this) || {};

	if (query.import === false) {
		return `module.exports = ${ JSON.stringify(contents) };`;
	}

	let imports = [];
	let source = [];

	let parts = contents.split(regex_include);
	while (parts.length) {
		let line = parts.shift().trim();
		if (line) {
			source.push(JSON.stringify(line));
		}

		if (parts.shift()) {
			let file = parts.shift();
			let delimiter = parts.shift();

			source.push(`import${imports.length}`);

			if (delimiter === '"') {
				file = `./${file}`;
			}
			else {
				file = `shaders/${file}`;
			}

			imports.push(`var import${imports.length} = require("${file}");`);
		}
	}

	source = source.filter((line) => line !== '""');

	return imports
		.concat([ '', source.length > 1
			? `module.exports = [${source.join(',')}].join("\\n");`
			: `module.exports = ${source};`,
		])
		.join('\n')
		.trim();
};
