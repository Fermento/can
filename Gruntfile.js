'use strict';
var banner1 = "\
/*\n\
   'oO0K0kdc'.   .o\n\
 :ko,.  ...',::;dk,     fermen.to\n\
oK.            .K,      <%= pkg.name %> for <%= pkg.client %> - v<%= pkg.version %>\n\
0x    .K:      x0       -\n\
'0:   dk.    .,KO:o.'   <%= grunt.template.today('yyyy-mm-dd') %>\n\
  ':;:.    ck'cX:\n\
       ,  ,.  kO\n\
     ;K:     :K.\n\
     ,0,   .od.\n\
      .oOOOo.\n\
*/\n";

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//## CSS
		sass: {
			dev: {
				files: [{
					expand: true,
					cwd: 'dev/scss/',
					src: ['**/*.scss', '!_*'],
					dest: 'res/css/',
					ext: '.css'
				}]
			}
		},
		autoprefixer: {
			dev: {
				options: {
					browsers: ['last 4 versions', 'ie 8', 'ie 9']
				},
				expand: true,
				cwd: 'res/css/',
				src: ['**/*.css'],
				dest: 'res/css/'
			}
		},
		cssmin: {
			dev: {
				options: {
					 banner: banner1,
					 sourceMap: true
				},
				files: [{
					expand: true,
					cwd: 'res/css/',
					src: ['**/*.css', '!**/*.min.css'],
					dest: 'res/css/',
					ext: '.min.css'
				}]
			}
		},
		clean: {
			css: ['res/css/**/*.css', '!res/css/**/*.min.css']
		},
		//## Javascript
		uglify: {
			options: {
				//sourceMap: 'js/source-map.js.map',
				 banner: banner1,
				 sourceMap: true
			},
			dev: {
				files: [{
					expand: true,
					cwd: 'dev/js/',
					src: ['**/*.js', '!_*'],
					dest: 'res/js/',
					ext: '.min.js'
				}]
			}
		},
		jshint: {
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			},
			files: ['dev/js/**/*.js']
		},
		//## Imagens
		imagemin: {
			dev: {
				files: [{
					expand: true,
					cwd: 'dev/img/',
					src: ['**/*.{png,jpg,gif,JPG}'],
					dest: 'res/img/'
				}]
			}
		},
		delete_sync: {
			dev: {
				cwd: 'res/img/',
				src: ['**/*.{png,jpg,gif,JPG}'],
				syncWith: 'dev/img/'
			}
		},
		//## Watch
		watch: {
			//CSS
			scss: {
				files: 'dev/scss/**/*.scss',
				tasks: ['sass:dev', 'autoprefixer:dev', 'cssmin:dev', 'clean:css'],
				options: {
					livereload: true
				}
			},
			//JS
			js: {
				files: 'dev/js/**/*.js',
				tasks: ['jshint','uglify:dev'],
				options: {
					livereload: true
				}
			},
			// Images
			images: {
				files: 'dev/img/**/*',
				tasks: ['imagemin:dev'],
				options: {
					livereload: true,
					event: ['added', 'changed'],
				}
			},
			imagesync: {
				files: 'dev/img/**/*',
				tasks: ['delete_sync:dev'],
				options: {
					event: ['deleted'],
				}
			},
			// Alteração FrontEnd
			livereload: {
				files: ['**/*.{php,html,htm,inc}'],
				options: {
					livereload: true
				}
			},
		},
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-delete-sync');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	// Default
	grunt.registerTask('default', 'watch');
};