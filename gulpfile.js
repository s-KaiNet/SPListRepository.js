var gulp = require("gulp"),
	path = require("path"),
	util = require("util"),
	$ = require("gulp-load-plugins")({
		rename: {
			"gulp-typescript": "ts"
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
		.pipe($.beautify({indentSize: 2}))
		.pipe($.concat("sp.list.repository.js"))
		.pipe(gulp.dest("./ts/build/"))
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

		return tsResult.dts.pipe(gulp.dest("./build/"));
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

gulp.task("spsave", ["js-dev"], function(){
    return gulp.src("./build/*.js")
        .pipe($.spsave(sett));
});

gulp.task("watch", function () {
	gulp.watch(["ts/**/*.ts"], ["ts", "js-dev", "spsave"]);
});