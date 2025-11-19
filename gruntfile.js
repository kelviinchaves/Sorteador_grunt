const { loadNpmTasks, task } = require("grunt");

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
,           less: {
                development: {
                    files: {
                        'temp/main.css': 'src/styles/main.less'
                    }
                },
                production: {
                    options: {
                        compress: true,
                    },
                    files: {
                        'dist/styles/main.min.css': 'src/styles/main.less'
                    }
                }
            }, 
        replace:{
            dev: {
                options: {
                    patterns: [
                        { match: 'endereco_do_css',
                         replacement: './styles/main.css'
                        },

                         { match: 'endereco_do_js',
                         replacement: './scripts/main.js'
                        }
                    ]
                },
                    files: [
                        {
                            expand: true,
                            flatten: true,
                            src: ['src/index.html'],
                            dest: 'dev/'
                        }
                    ]
            },
            dist: {
                options: {
                    patterns: [
                        { 
                            match: 'endereco_do_css',
                            replacement: './styles/main.min.css' 
                        },
                        {
                            match: 'endereco_do_js',
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        watch: {
            less: {
                files: ['src/styles/*.less'],
                tasks: ['less:development']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },
        uglify: {
            build: {
                files: {
                    'dist/scripts/main.min.js': ['src/scripts/main.js']
                }
            }
        },

        clean: {
            temp: ['temp'] // apaga a pasta temp antes de recriar
        },
    });
    grunt.loadNpmTasks('grunt-contrib-less');  // carredando a tarefa less para compilar arquivos .less em .css}
    grunt.loadNpmTasks('grunt-contrib-watch'); // carregando o plugin watch 
    grunt.loadNpmTasks('grunt-replace'); // carregando o plugin replace para substituir arquivos
    grunt.loadNpmTasks('grunt-contrib-uglify'); // carregando o plugin uglify para minificar arquivos js
    grunt.loadNpmTasks('grunt-contrib-clean'); // carregando o plugin clean para limpar pastas

    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', ['less:production', 'replace:dist', 'clean']);
}       