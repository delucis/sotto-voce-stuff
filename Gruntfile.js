module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    modernizr: {
      dist: {
        "crawl": false,
        "customTests": [],
        "dest": "js/builds/modernizr-build.js",
        "tests": [
          "applicationcache",
          "webaudio",
          "localstorage"
        ],
        "options": [
          "setClasses"
        ],
        "uglify": true
      }
    },
    yaml: {
      your_target: {
        options: {
          ignored: /^_/,
          space: 2,
          customTypes: {
            '!include scalar': function(value, yamlLoader) {
              return yamlLoader(value);
            },
            '!max sequence': function(values) {
              return Math.max.apply(null, values);
            },
            '!extend mapping': function(value, yamlLoader) {
              return _.extend(yamlLoader(value.basePath), value.partial);
            }
          }
        },
        files: [
          {expand: true, cwd: '', src: ['*.yml'], dest: ''}
        ]
      }
    },
    'json-minify': {
      build: {
        files: 'cue-data.json'
      }
    },
    uglify: {
      js: {
        files: {
          'js/builds/app.js': [
            'js/vendor/bootstrap.min.js',
            'node_modules/snackbarjs/dist/snackbar.min.js',
            'js/builds/modernizr-build.js',
            'js/vendor/AudioContextMonkeyPatch.js',
            'js/main.js',
            'js/diagnostics.js'
          ]
        }
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      target: {
        files: {
          'css/builds/app.min.css': [
            'css/bootstrap.min.css',
            'node_modules/snackbarjs/dist/snackbar.min.css',
            'node_modules/snackbarjs/themes-css/material.css',
            'css/fonts.css',
            'css/bootstrap-cyborg.min.css',
            'css/main.css'
          ]
        }
      }
    },
    copy: {
      general: {
        files: [
          {
            cwd: '',
            src: [
              'index.html',
              '*.ico',
              'browserconfig.xml',
              '.htaccess',
              'js/vendor/jquery-1.11.2.min.js',
              'fonts/**'
            ],
            dest: 'svs',
            expand: true
          }
        ]
      },
      cues: {
        files: [
          {
            cwd: '',
            src: [ 'cue-data.json' ],
            dest: 'svs',
            expand: true
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['js/builds/app.js'],
            dest: 'svs/js/',
            filter: 'isFile'
          }
        ]
      },
      css: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['css/builds/app.min.css'],
            dest: 'svs/css/',
            filter: 'isFile'
          }
        ]
      },
      icons: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['icons/*'],
            dest: 'svs/',
            filter: 'isFile'
          }
        ]
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: 'svs/',
          cache: [],
          fallback: ['/ index.html'],
          exclude: [],
          preferOnline: true,
          headcomment: " <%= pkg.name %> v<%= pkg.version %>",
          verbose: true,
          timestamp: true
        },
        src: [
          '*.html',
          '*.json',
          'css/*.css',
          'js/*.js',
          'js/vendor/*.js',
          'fonts/*.woff'
        ],
        dest: 'svs/index.appcache'
      }
    },
    clean: {
      build: {
        src: [ 'svs' ]
      },
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: 'svs',
          hostname: '*',
          open: true
        }
      }
    },
    watch: {
      general: {
        files: ['index.html', '*.ico', 'browserconfig.xml', 'js/vendor/jquery-1.11.2.min.js', 'fonts/**'],
        tasks: ['copy:general', 'manifest']
      },
      cues: {
        files: ['cue-data.yml'],
        tasks: ['yaml', 'json-minify', 'copy:cues', 'manifest']
      },
      scripts: {
        files: ['js/main.js', 'js/diagnostics.js', 'js/vendor/*.js'],
        tasks: ['uglify', 'copy:js', 'manifest']
      },
      styles: {
        files: ['css/main.css', 'css/fonts.css', 'css/bootstrap.min.css', 'css/bootstrap-cyborg.min.css'],
        tasks: ['cssmin', 'copy:css', 'manifest']
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.registerTask(
    'default',
    'Run “grunt build”, serve to localhost:4000, and watch for changes.',
    ['build', 'connect', 'watch']
  );
  grunt.registerTask(
    'build',
    'Clean & (re)build distribution-ready project in /svs',
    ['modernizr:dist', 'yaml', 'json-minify', 'uglify', 'cssmin', 'clean', 'copy:general', 'copy:cues', 'copy:js', 'copy:css', 'copy:icons', "manifest"]
  );
};
