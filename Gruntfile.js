module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Atividades concorrentes
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // Nodemon (Rodando o Node)
    nodemon: {
      dev: {
        script: '<%= pkg.main %>',
        options: {
          nodeArgs: ['--debug'],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },

    // // DEV
    compass: {
      dev: {
        options: {
          sassDir: 'dev/scss',
          cssDir: 'atv/css'
        }
      }
    },

    // Monitoramento de arquivos
    watch: {
      dev: {
        files: ['.rebooted','sys/**/*'],
        options: {
          livereload: true
        }
      },
      css: {
        files: '**/*.scss',
        tasks: ['compass'],
        options: {
          livereload: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
};
