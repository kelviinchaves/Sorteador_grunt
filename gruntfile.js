const { loadNpmTasks, task } = require("grunt");

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),




        // configurando a tarefa less para compilar arquivos .less em .css
        less: {  
            
            //transformando o arquivo main.less em main.css
            development: { 
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'  // arquivo de destino main.css e de origem main.less
                }
            },
            production: {
                options: {
                    compress: true,  // opçao para comprimir o arquivo final
                },
                files: {    
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }   
            },
            // --------------------------------         
        },





        // configurando a tarefa watch para monitorar mudanças nos arquivos .less
        watch: { // watch fica de olho nas mudanças dos arquivos e executa as tarefas automaticamente
            less: {
                files: ['src/styles/**/*.less'], // monitorar todos os arquivos .less dentro da pasta styles e suas subpastas
                tasks: ['less:development'],   // tarefa a ser executada quando houver mudanças nos arquivos monitorados
            },
            html: { // fica de olho no index.html da pasta src e se houver mudança roda em replace:dev
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },





        // configurando a tarefa replace para substituir o endereco do arquivo css no index.html
        replace: {
            dev: {//troca o endereco do css para o arquivo nao minificado
                options: {
                    patterns: [
                        
                        
                        { // no html trocar o destino de css pelo nome dentro de match
                            match: 'ENDERECO_DO_CSS', 
                            replacement: './styles/main.css' 
                        },
                            
                        {   match: 'ENDERECO_DO_JS',  
                            replacement: '../src/scripts/main.js' 
                        }
                    
                        ]
                },
                files: [{
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
                                match: 'ENDERECO_DO_CSS',
                                replacement: './styles/main.min.css'
                            },
                            {   match: 'ENDERECO_DO_JS',  
                            replacement: './scripts/main.min.js' 
                            }
                        ]
                },
                files: [{
                        expand: true, 
                        flatten: true, 
                        src: ['prebuild/index.html'], 
                        dest: 'dist/'
                        }
                    ]
                }
        },




        // configurando a tarefa htmlmin para minificar o arquivo index.html
        htmlmin: {
            dist:{
                options: {
                    removeComments: true, // remove os comentários do HTML
                    collapseWhitespace: true // faz com que todo espaço em brando seja apagado
                },
                files: { // 1 - fazer a minificaçao do arquivo index.html da pasta dev e colocar na pasta dist
                        // 2 - substitui o arquivo index.html da pasta src pelo minificado na pasta prebuild 
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },

        // configurando a tarefa clean para limpar pastas e arquivos
        clean: ['prebuild'] // tarefa para limpar a pasta prebuild apos a geraçao do arquivo final na pasta dist
        

        // configurando a tarefa do p[lugin grunt-contrib-uglify para minificar arquivos JS
        ,
        uglify: {
            target: {
                files: {
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
        
    });         

                    // CARREGANDO PLUGINS DO GRUNT

    grunt.loadNpmTasks('grunt-contrib-less');      //carregando o plugin do Less
    grunt.loadNpmTasks('grunt-contrib-watch');    // carregando o plugin do Watch
    grunt.loadNpmTasks('grunt-replace'); // carregando o plugin Replace
    grunt.loadNpmTasks('grunt-contrib-htmlmin'); // carregando o plugin para minificar o HTML
    grunt.loadNpmTasks('grunt-contrib-clean'); // carregando o plugin para limpar pastas e arquivos
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']); // tarefa padrao do Grunt OBS foi necessário trocar para watch para execuçao das tarefas de forma automatica
                        // até o momento o grunt tem executado de forma serial/ primeiro executa um e depois o outro, porém podemos executar de forma paralela (todos ao mesmo tempo) através do plugin grunt-concurrent
    
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']); // tarefa build para gerar os arquivos finais de produçao
}
