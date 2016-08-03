"use strict";

// build.input: input files
// build.output: output file
function buildCSS(system, build) {
	const path = require("path");

	const gulp = require("gulp");
	const rename = require("gulp-rename");
	const postcss = require("gulp-postcss");
	const plumber = require("gulp-plumber");
	const cssnano = require("cssnano");

	const parsedOutput = path.parse(build.output);
	const outputDir = parsedOutput.dir;
	const outputFile = parsedOutput.base;

	const errorHandler = (e) => {
		system.error("Error building CSS", e.message);
	};

	const plugins = [
		require("postcss-sassy-import")(),
		require("postcss-custom-properties"),
		require("postcss-nested"),
		require("autoprefixer", ["last 3 versions", "not IE < 10", "not ie_mob < 10"])
	];

	if (build.options.minify) {
		plugins.push(cssnano({ autoprefixer: false }));
	}

	return gulp.src(build.input)
		.on("end", () => system.note("Building CSS..."))
		.pipe(plumber(errorHandler))
		.pipe(postcss(plugins))
		.pipe(rename(outputFile))
		.pipe(gulp.dest(outputDir))
		.on("end", () => system.success("Finished building CSS"));
}

module.exports = buildCSS;