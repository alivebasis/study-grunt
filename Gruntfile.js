'use strict';

// Wrapper function
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var appConfig = {
    app: 'src', // source code
    dist: 'dist' // destination
  };

  // Project configuration.
  grunt.initConfig({
    prj: appConfig,
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    watch: {
      include: {
        files: [
          '<%= prj.app %>/html/tpls/*.html',
          '<%= prj.app %>/html/include/*.html'
        ],
        tasks: 'includereplace'
      },
      compass: {
        files: '<%= prj.app %>/scss/*.{scss,sass}',
        tasks: 'cssTasks',
        options: {
          spawn: false
        }
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile',
        options: {
          spawn: false
        }
      }
    },
    clean : {
      dist: {
        src: [
          '.tmp',
          '.grunt',
          '<%= prj.dist %>/**/*'
        ]
      }
    },
    useminPrepare: {
      html: '<%= prj.app %>/html/*.html',
      options: {
        dest: '<%= prj.dist %>/html'
      }
    },
    usemin: {
      html: '<%= prj.dist %>/html/*.html'
    },
    imagemin: {
      dist: {
        options: {
          optimiztionLevel: 5 // png
        },
        files: [{
          expand: true,
          cwd: '<%= prj.app %>/img',
          src: [
            '**/*.{png,jpg,jpeg,gif}',
            '!sprites/*.*'
          ],
          dest: '<%= prj.dist %>/img'
        }]
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= prj.app %>',
            dest: '<%= prj.dist %>',
            src: [
              '**/*.html',
              '!html/tpls/**/*.html',
              'js/libs/*.js'
            ]
          }
        ]
      }
    },
    'gh-pages': {
      options: {
        base: 'dist',
        message: 'Published to a gh-pages branch'
      },
      src: '**/*'
    },

    // HTML tasks
    includereplace: {
      dist: {
        expand: true,
        cwd: '<%= prj.app %>/html/tpls',
        src: '*.html',
        dest: '<%= prj.app %>/html'
      }
    },
    prettify: {
      options: {
        'indent': 1,
        'indent_char': '\t',
        'indent_inner_html': false
      },
      dist: {
        expand: true,
        cwd: '<%= prj.dist %>/html',
        src: '*.html',
        dest: '<%= prj.dist %>/html'
      }
    },

    // CSS tasks
    compass: {
      dist: {
        options: {
          sassDir: '<%= prj.app %>/scss',
          cssDir: '<%= prj.app %>/css',
          outputStyle: 'compact'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: [
          '> 1%', // support browser versions that have more than 1% of global usage
          'Last 2 versions', // the latest 2 versions of each browser
          'iOS >= 6',
          'Android 2.3',
          'Android >= 4',
          'ie >= 8',
          'Firefox >= 20',
          'Opera >= 10'
        ]
      },
      dist: {
        src: '<%= prj.app %>/css/*.css'
        //dest: '<%= prj.app %>/css/'
      }
    },
  /*  cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= prj.app %>/css',
          src: '*.css',
          dest: '<%= prj.dist %>/css',
          ext: '.min.css'
        }]
      }
    },*/
    sprite: {
      dist: {
        src: '<%= prj.app %>/img/sprites/*.png',
        retinaSrcFilter: '<%= prj.app %>/img/sprites/*@2x.png',
        dest: '<%= prj.app %>/img/sp.png',
        retinaDest: '<%= prj.app %>/img/sp@2x.png',
        destCss: '<%= prj.app %>/scss/_sprites.scss',
        padding: 2
      }
    },

    // JS tasks
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      dist: {
        expand: true,
        cwd: '<%= prj.app %>/js',
        src: '*.js',
        dest: '<%= prj.app %>/js'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    }/*,
    concat: {
      generated: {
        files: [{
          src: '<%= prj.app %>/js/apps/*.js',
          dest: '.tmp/concat/js/service.min.js'
        }]
      }
    },
    uglify: {
      generated: {
        files: [{
          src: '.tmp/concat/js/service.min.js',
          dest: '<%= prj.dist %>/js/service.min.js'
        }]
      }
    }*/
  });

  // Default task.
  grunt.registerTask('default', ['watch']);

  // CSS tasks
  grunt.registerTask('cssTasks', ['sprite', 'compass', 'autoprefixer']);

  // Build tasks
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'imagemin',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'copy',
    'prettify',
    'usemin'
  ]);

  // Deploy tasks
  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);
};