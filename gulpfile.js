var gulp = require("gulp"),
	path = require("path"),
	util = require("util"),
	$ = require("gulp-load-plugins")({
		rename: {
			"gulp-typescript": "ts"
		}
	});
var sett = {
            username: "SergeiSergeev@mastekapps.onmicrosoft.com",
            password: "QazWsx123",
            siteUrl: "https://mastekapps.sharepoint.com/sites/dev",
            folder: "SiteAssets"
        };
var jsSrc = ["ts/src/Helpers.js",
			"ts/src/Constants.js", 
			"ts/src/RequestError.js",
			"ts/src/QuerySettings.js",
			"ts/src/ListService.js",
			"ts/src/ViewScope.js",
			"ts/src/BaseListItem.js",
			"ts/src/ListRepository.js"];

gulp.task("js-dev", function () {
	return gulp.src(jsSrc)
		.pipe($.beautify({indentSize: 2}))
		.pipe($.concat("sp.list.repository.js"))
		.pipe(gulp.dest("./ts/build/"))
		.pipe($.rename({ suffix: ".min" }))
		.pipe($.uglify())
		.pipe(gulp.dest("./ts/build"));
});

gulp.task("ts-def", function(){
	var tsResult = gulp.src("ts/src/**/*.ts")
			.pipe($.ts({
				target: "ES5",
				declaration: true,
				out: "sp.list.repository.js"
			}));

		return tsResult.dts.pipe(gulp.dest("./ts/build/"));
});

gulp.task("spsave", ["js-dev"], function(){
    return gulp.src("./ts/build/*.js")
        .pipe($.spsave(sett));
});

gulp.task("watch", function () {
	gulp.watch(["ts/src/**/*.ts", "ts/extensions/*.ts"], function(event){
			var dateNow = new Date();
			var dateString = util.format("[%s:%s:%s]", 
			("0" + dateNow.getHours()).slice(-2), 
			("0" + dateNow.getMinutes()).slice(-2), 
			("0" + dateNow.getSeconds()).slice(-2));
			
			console.log(util.format("%s Compiling .ts file", dateString));
			
		var tsResult = gulp.src([event.path])
			.pipe($.ts({
				target: "ES5",
				declaration: false,
				removeComments: true
			}));

		return tsResult.js.pipe(gulp.dest(path.dirname(event.path)));
	});
	
	gulp.watch(["ts/src/**/*.js"], ["js-dev", "spsave"]);
});