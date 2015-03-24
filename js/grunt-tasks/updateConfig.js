var fs = require("fs");

var buildTemplate = "" +
"(function(){" +
	"\"use strict\";" +
	"window.SPListRepo.isDebug = %s; " +
"})();";

var childProcess = require("child_process");
module.exports = function (grunt) {
	grunt.registerTask("updateConfig", function () {
		console.log("Updating config.js file");

		var self = this;
		var done = this.async();
		var isDebug = self.flags.dev ? 1 : 0;
		var str = require("util").format(buildTemplate, isDebug);
		
		fs.writeFile(__dirname + "\\..\\src\\config.js", str, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("The file was updated.");
			}
			done();
		});
	});
};