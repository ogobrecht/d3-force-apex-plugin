/* global module */
module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("apexplugin.json"),
        banner: '/**\n' +
            ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) 2015<%= parseInt(grunt.template.today("yyyy")) > 2015 ? "-" + grunt.template.today("yyyy") : "" %> <%= pkg.author.name %> - <%= pkg.license %> license\n' +
            ' */\n',
        jshint: {
            files: [
                "Gruntfile.js",
                "apexplugin.json",
                "sources/d3-force-network-chart.js"
            ]
        },
        copy: {
            task1: {
                src: "sources/d3-force-network-chart.js",
                dest: "server/d3-force-network-chart.js",
                options: {
                    process: function(content, srcpath) {
                        return grunt.template.process("<%= banner %>") + "\n" +
                            content.replace(/x\.x\.x/g, grunt.template.process("<%= pkg.version %>"));
                    }
                }
            },
            task2: {
                src: "sources/d3-force-network-chart.css",
                dest: "server/d3-force-network-chart.css"
            },
            task3: {
                src: "sources/example.html",
                dest: "server/example.html",
                options: {
                    process: function(content) {
                        return content.replace(/x\.x\.x/g, grunt.template.process("<%= pkg.version %>"));
                    }
                }
            }
        },
        uglify: {
            options: {
                banner: "<%= banner %>"
            },
            server: {
                src: "server/d3-force-network-chart.js",
                dest: "server/d3-force-network-chart.min.js"
            },
        },
        clean: ["docs"],
        jsdoc: {
            dist: {
                src: ["sources/*.js", "README.md"],
                options: {
                    destination: "docs",
                    tutorials: "tutorials",
                    template: "node_modules/minami",
                    configure: ".jsdoc.json"
                }
            }
        },
        watch: {
            files: [
                "Gruntfile.js",
                "apexplugin.json",
                "sources/*",
            ],
            tasks: ["default"]
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-notify");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.registerTask("default", ["jshint", "copy", "uglify", "clean", "jsdoc"]);
};
