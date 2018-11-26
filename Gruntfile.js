/* global module */
module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("apexplugin.json"),
        currentYear: parseInt(grunt.template.today("yyyy")),
        banner: '/**\n' +
            ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) 2015<%= currentYear > 2015 ? "-" + currentYear : "" %> <%= pkg.author.name %> - <%= pkg.license %> license\n' +
            ' */\n',
        exampleGraph: '<button onclick="example.useDomParentWidth((example.useDomParentWidth()?false:true))">Toggle option useDomParentWidth</button>\n' + 
            '<div id="example"></div><!--the graph container-->\n' +
            '<link  href="./lib/d3-force-<%= pkg.version %>.css" rel="stylesheet" type="text/css">\n' +
            '<script src="./lib/ResizeObserver-1.5.0.min.js"></script>\n' +
            '<script src="./lib/d3-3.5.6.min.js"></script>\n' +
            '<script src="./lib/d3-force-<%= pkg.version %>.min.js"></script>\n' +
            '<script>\n' +
            '  window.onload = function (){\n' +
            '    window.example = netGobrechtsD3Force("example")\n' +
            '      .width(600)\n' +
            '      .height(400)\n' +
            '      .lassoMode(true)\n' +
            '      .wrapLabels(true)\n' +
            '      .debug(true) //also creates the "Customize Me" link\n' +
            '      .render(); //sample data is provided when called without data\n' +
            '  }\n' +
            '</script>\n',
        jshint: {
            files: [
                "Gruntfile.js",
                "apexplugin.json",
                "src/d3-force.js"
            ]
        },
        clean: ["docs", "dist/*.css", "dist/*.js"],
        copy: {
            dist1: {
                src: "src/d3-force.js",
                dest: "dist/d3-force-<%= pkg.version %>.js",
                options: {
                    process: function(content, srcpath) {
                        return grunt.template.process("<%= banner %>") + "\n" +
                            content.replace(/x\.x\.x/g, grunt.template.process("<%= pkg.version %>"));
                    }
                }
            },
            dist2: {
                files: [{
                        src: "src/d3-force.css",
                        dest: "dist/d3-force-<%= pkg.version %>.css"
                    },
                    {
                        src: "src/example.html",
                        dest: "dist/example.html"
                    },
                    {
                        src: "src/LICENSE.txt",
                        dest: "LICENSE.txt"
                    }
                ],
                options: {
                    process: function(content) {
                        return content
                            .replace(/x\.x\.x/g, grunt.template.process("<%= pkg.version %>"))
                            .replace(/{{CURRENT-YEAR}}/g, grunt.template.process("<%= currentYear %>"))
                            .replace(/{{EXAMPLE-GRAPH}}/g, grunt.template.process("<%= exampleGraph %>"));
                    }
                }
            },
            docs1: {
                files: [{
                    src: "docs/tutorial-1-getting-started.html",
                    dest: "docs/tutorial-1-getting-started.html"
                }],
                options: {
                    process: function(content, srcpath) {
                        return content.replace(/{{EXAMPLE-GRAPH}}/g, grunt.template.process("<%= exampleGraph %>"))
                            .replace(/{{EXAMPLE-GRAPH-CODE}}/g, grunt.template.process("<%= exampleGraph %>").replace(/</g, "&lt;"));
                    }
                }
            },
            docs2: {
                files: [{
                        src: "dist/lib/d3/d3-3.5.6.min.js",
                        dest: "docs/lib/d3-3.5.6.min.js"
                    },
                    {
                        src: "dist/lib/resize-observer-polyfill/ResizeObserver-1.5.0.min.js",
                        dest: "docs/lib/ResizeObserver-1.5.0.min.js"
                    },
                    {
                        src: "dist/d3-force-<%= pkg.version %>.css",
                        dest: "docs/lib/d3-force-<%= pkg.version %>.css"
                    },
                    {
                        src: "dist/d3-force-<%= pkg.version %>.min.js",
                        dest: "docs/lib/d3-force-<%= pkg.version %>.min.js"
                    }
                ]
            }
        },
        uglify: {
            options: {
                banner: "<%= banner %>"
            },
            dist: {
                src: "dist/d3-force-<%= pkg.version %>.js",
                dest: "dist/d3-force-<%= pkg.version %>.min.js"
            },
        },
        jsdoc: {
            docs: {
                src: ["README.md", "src/*.js"],
                options: {
                    destination: "docs",
                    tutorials: "src/tutorials",
                    template: "node_modules/minami",
                    configure: ".jsdoc.json"
                }
            }
        },
        watch: {
            files: [
                "Gruntfile.js",
                "apexplugin.json",
                "src/**"
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
    grunt.registerTask("default", ["jshint", "clean", "copy:dist1", "copy:dist2", "uglify", "jsdoc", "copy:docs1", "copy:docs2"]);
};
