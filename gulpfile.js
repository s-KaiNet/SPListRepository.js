var gulp = require("gulp"),
	path = require("path"),
	util = require("util"),
	runSequence = require('run-sequence'),
	$ = require("gulp-load-plugins")({
		rename: {
			"gulp-typescript": "ts",
			"gulp-jasmine-inject": "jasmineInject"
		}
	});
	
var sett = require("./settings");

gulp.task("js-dev", function () {
	return gulp.src("ts/_references.ts")
		.pipe($.ts({
			target: "ES5",
			declaration: false,
			outFile: "sp.list.repository.js"
		}))
		.js
		.pipe($.jsbeautifier({mode: "VERIFY_AND_WRITE"}))
		.pipe(gulp.dest("./build"))
		.pipe($.rename({ suffix: ".min" }))
		.pipe($.uglify())
		.pipe(gulp.dest("./build"));
});

gulp.task("ts-def", function(){
	var tsResult = gulp.src("ts/**/*.ts")
			.pipe($.ts({
				target: "ES5",
				declaration: true,
				out: "sp.list.repository.js"
			}));

		return tsResult.dts.pipe(gulp.dest("./build"));
});

gulp.task("ts-tests", function(){
	return gulp.src("tests/**/*.ts")
		.pipe($.ts({
			target: "ES5",
			declaration: false
		}))
		.js
		.pipe(gulp.dest("./tests/js"));
});

gulp.task("tests", ["ts-tests"], function(){
	return gulp.src("tests/js/spec.js")
		.pipe($.jasmineInject({
			siteUrl: sett.siteUrl,
			username: sett.username,
			password: sett.password,
			phantomInitCallbacks: [path.resolve("./tests/lib/sharepoint.callback.js")],
			additionalJS: ["./tests/lib/jquery.js", 
							"./tests/lib/camljs.js",
							"./build/sp.list.repository.js",
							"./tests/js/TestCategories.js",
							"./tests/js/TestLib.js"],
			verbose: false
		}))
		.pipe(gulp.dest("tests/test_results"));
});

gulp.task("spsave", function(){
    return gulp.src("./build/*.js")
        .pipe($.spsave(sett));
});

gulp.task("nuget", function(){
	return gulp.src(["build/sp.list.repository.min.js", "build/sp.list.repository.d.ts"])
  				.pipe(gulp.dest("NuGet/content/Scripts"));
});

gulp.task("build", function() {
	runSequence("js-dev", ["ts-def", "spsave"], "nuget");
});

gulp.task("watch", function () {
	gulp.watch(["ts/**/*.ts"], ["build"]);
});