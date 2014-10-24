'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
  
    sass: {
      dev: {
        options: {
          outputStyle: 'compact'
        },
        files: [{
          expand: true,
          cwd: 'dev/css/',
          src: ['*.scss'],
          dest: 'css/',
          ext: '.css'
        }]
      }
    },
    
    cssmin: {
      minify: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: 'css/',
          ext: '.min.css'
        }]        
      }
    },
    
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['**/*.{png,jpg,gif,JPG}'],
          dest: 'img/'
        }]
      }
    },
    
    autoprefixer: {
      dev: {
        options: {
          browsers: ["last 4 versions", "ios 6","ie 9"]
        },
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/'
      }
    },
      
    watch: {
      sass: {
        files: 'dev/sass/**/*.scss',
        tasks: ['sass:dev','autoprefixer:dev','cssmin:minify']
      },  
      livereload: {
        files: ['**/*.html','js/*.js','dev/**/*'],
        options: {
          livereload: true
        }
      },
    },
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  
  // Default
  grunt.registerTask('default', 'watch');
};
