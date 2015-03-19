module.exports = function (grunt) {

var srcFiles =["src/Helpers.js", "src/RequestError.js", "src/ListService.js"];

	grunt.initConfig({
		uglify:{
			release: {
				  options: {
					sourceMap: false
				},
				files: [
					{src: srcFiles, dest: "build/sp.list.repository.min.js"}
				]
			}
		},
		concat: {
			dev:{
				options: {
				  separator: '\r\n'
				},
				files: [
					{src: srcFiles, dest: "build/sp.list.repository.js"}
				]
			}
		}		
	});

	grunt.registerTask("default", ["uglify:release", "concat:dev"]);

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
};