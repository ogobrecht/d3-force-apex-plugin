/* global module */
module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        path: {
            lint: [
                "Gruntfile.js",
                "js/d3-force-2.1.0beta1.js"
            ]
        },
        jshint: {
            files: "<%= path.lint %>",
            options: {
                jshintrc: true
            }
        },
        uglify: {
            myTarget: {
                files: {
                    "js/d3-force-2.1.0beta1.min.js": ["js/d3-force-2.1.0beta1.js"]
                }
            }
        },
        watch: {
            files: "<%= path.lint %>",
            tasks: ["jshint","uglify"]
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-notify");
    grunt.registerTask("default", ["jshint", "uglify"]);
};
