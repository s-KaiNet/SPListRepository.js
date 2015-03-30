module.exports = function (grunt) {

var srcFiles =[
				"src/Helpers.js",
				"src/config.js",
				"src/Constants.js", 
				"src/RequestError.js", 
				"src/ListService.js",
				"src/ViewScope.js",
				"src/QuerySettings.js",
				"src/Base/BaseListItem.js",
				"src/Base/ListRepository.js"];

	grunt.initConfig({
		
		uglify:{
			release: {
				  options: {
					sourceMap: false,
					compress: {
						sequences: false,
						drop_debugger: true,
						drop_console: true
					}
				},
				files: [
					{src: srcFiles, dest: "build/release/sp.list.repository.min.js"}
				]
			},
			dev:{
				options: {
					sourceMap: false,
					mangle: false,
					beautify: true,
					compress: {
						sequences: false,
						drop_debugger: false,
						drop_console: false
					}
				},
				files: [
					{src: srcFiles, dest: "build/release/sp.list.repository.js"},
					{src: srcFiles, dest: "build/dev/sp.list.repository.js"}
				]
			}
		},
		
		watch: {
			scripts: {
				files: ["src/**/*.js"],
				tasks: ["dev"],
				options: {
					spawn: false
				}
			}
		},
		
		copy: {
			nuget: {
				cwd: "build/release/",
				src: "sp.list.repository.min.js",
				dest: "../NuGet/content/Scripts/",
				flatten: true,
				expand: true
			}
		}
	});

	grunt.registerTask("release", ["uglify:release", "copy:nuget"]);
	grunt.registerTask("dev", ["uglify:dev"]);

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
};