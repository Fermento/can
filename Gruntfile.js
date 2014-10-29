'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
  
  	sass: {
      dev: {
      	options: {
	      	outputStyle: 'nested'
      	},
        files: [{
	        expand: true,
			    cwd: 'dev/scss/',
			    src: ['**/*.scss'],
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
		  	files: [{
	        expand: true,
			    cwd: 'res/css/',
			    src: ['**/*.css','!**/*.min.css'],
			    dest: 'res/css/',
			    ext: '.min.css'
	      }]		    
		  }
		},
		
		clean: {
			css: ['res/css/**/*.css', '!res/css/**/*.min.css']
		},
		
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
			
    watch: {
	    //CSS
    	css: {
	    	files: 'dev/scss/**/*.scss',
	    	tasks: ['sass:dev','autoprefixer:dev','cssmin:dev','clean:css'],
	    	options: {
          livereload: true
        }
    	},
    	
    	// Images
    	images: {
	    	files: 'dev/img/**/*.{png,jpg,gif,JPG,GIF,PNG}',
	    	tasks: ['imagemin:dev'],
	    	options: {
          livereload: true,
          event: ['added','changed'],
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
        files: ['**/*.{php,html,htm,inc}','res/**/*.js'],
        options: {
          livereload: true
        }
      },
		},
	});
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-delete-sync');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  
  // Default
  grunt.registerTask('default', 'watch');
};
