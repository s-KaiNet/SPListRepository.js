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

var jsSrc = ["js/Helpers.js",
			"js/Constants.js", 
			"js/RequestError.js",
			"js/QuerySettings.js",
			"js/ListService.js",
			"js/ViewScope.js",
			"js/BaseListItem.js",
			"js/ListRepository.js"];

gulp.task("js-dev", function () {
	return gulp.src(jsSrc)
		.pipe($.jsbeautifier({mode: "VERIFY_AND_WRITE"}))
		.pipe($.concat("sp.list.repository.js"))
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

gulp.task("ts", function(){
	return gulp.src("ts/**/*.ts")
		.pipe($.ts({
			target: "ES5",
			declaration: false
		}))
		.js
		.pipe(gulp.dest("./js"));
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
})

gulp.task("watch", function () {
	gulp.watch(["ts/**/*.ts"], function(){
		runSequence("ts", "js-dev", ["ts-def", "spsave"], "nuget");
	});
});