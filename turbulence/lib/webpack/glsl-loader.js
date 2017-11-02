let regex_include = /#include (<|")(.+?)("|>)/;

module.exports = function(contents) {
	this.cacheable();

	let imports = [];
	let source = [];

	let parts = contents.split(regex_include);
	while (parts.length) {
		let line = parts.shift();

		if (line.trim()) {
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
		.concat([ '', `module.exports = [${source.join(',')}].join("");` ])
		.join('\n')
		.trim();
};
