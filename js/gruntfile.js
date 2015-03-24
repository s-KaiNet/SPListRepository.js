module.exports = function (grunt) {

var srcFiles =[
				"src/Helpers.js",
				"src/config.js",
				"src/Logger.js",
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
					sourceMap: false
				},
				files: [
					{src: srcFiles, dest: "build/release/sp.list.repository.min.js"}
				]
			}
		},
		concat: {
			dev:{
				options: {
				  separator: '\r\n'
				},
				files: [
					{src: srcFiles, dest: "build/dev/sp.list.repository.js"}
				]
			},
			release:{
				options: {
				  separator: '\r\n'
				},
				files: [
					{src: srcFiles, dest: "build/release/sp.list.repository.js"}
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
		updateConfig: {
			dev: {},
			release: {}
		}
	});

	grunt.registerTask("release", ["updateConfig:release", "uglify:release", "concat:release"]);
	grunt.registerTask("dev", ["updateConfig:dev", "concat:dev"]);

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.loadTasks("grunt-tasks");
};