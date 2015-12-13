"use strict";

// Módulos (Requires)
var gulp = require('gulp');
var gutil = require('gulp-util');
var p = require('gulp-load-plugins')();

// //// Utilitários
var path = require('path');
var rimraf = require('rimraf');
var pngquant = require('imagemin-pngquant');
var runSequence = require('run-sequence');

// Ambientes
var dev = p.environments.development;
var prd = p.environments.production;

// Constantes
var PASTA_DEV = 'dev/'
var PASTA_DEST = 'res/'

// Variáveis públicas
var banner = ""
var caminhos = {}
var pkg;
var worker;

// Configurações do Package (projeto)
pkg = require('./package.json')

/*
 * Configurações
 */

//TODO: Kraken API Key/Switch

// Seta os caminhos padrão
caminhos = {
	"css": {
		"origem": path.join(PASTA_DEV, 'app/**/*.scss'),
		"destino": path.join(PASTA_DEST, 'app/')
	},

	"js": {
		"origem": path.join(PASTA_DEV, 'app/**/*.js'),
		"destino": path.join(PASTA_DEST, 'app/')
	},

	"hogan": {
		"origem": path.join(PASTA_DEV, 'app/**/*.hogan'),
		"destino": path.join(PASTA_DEST, 'app/')
	},

	"img": {
		"origem": path.join(PASTA_DEV, 'img/**/*'),
		"destino": path.join(PASTA_DEST, 'img/')
	},

	"libs": {
		"origem": path.join(PASTA_DEV, 'lib/**/*.!(md|txt|html|json)'),
		"destino": path.join(PASTA_DEST, 'lib/')
	},

	"dist": {
		"origem": 'dist/',
	}
}

// Banner (meta)
banner = ['',
	'/**',
	'   oO0K0kdc.   .o',
	' :ko,.  ...",::;dk,     fermen.to',
	'oK.            .K,      <%= name %> - v<%= version %>', //
	'0x    .K:      x0',
	'"0:   dk.    .,KO:o."',
	'  ":;:.    ck"cX:',
	'       ,  ,.  kO',
	'     ;K:     :K.',
	'     ,0,   .od.',
	'      .oOOOo.*/',
	'', ''
].join('\n');

/*
 * CSS
 */

//TODO: Output (console)

gulp.task('css', function(event) {
	return gulp.src(caminhos.css.origem)
		//.pipe(p.plumber({errorHandler: (a) => console.log(a)}))
		// Pré-processamento
		.pipe(p.sass())
		.on('error', console.log)
		.pipe(prd(p.shorthand()))
		.pipe(p.pleeease({"minifier": prd(), "autoprefixer": {browsers: ['last 2 versions', 'ie 9', '> 1%']}}))
		.pipe(prd(p.csso()))
		// Cabeçalho
		.pipe(p.header(banner, pkg))
		// Minificar e otimizar
		.pipe(p.rename({extname: ".min.css"}))
		.pipe(prd(p.size()))
		.pipe(gulp.dest(caminhos.css.destino))
		//
		.pipe(dev(p.livereload()))
});

/*
 * Scripts (JS)
 */

//TODO: Output (Console)
gulp.task('js', function(event) {
	return gulp.src(caminhos.js.origem)
		.pipe(p.plumber())
		// JSHint
		.pipe(dev(p.jshint({"asi":true})))
		.pipe(dev(p.jshint.reporter('default')))
		// Concatena arquivos
		.pipe(p.concat('frmnt.js'))
		// Minificador
		.pipe(prd(p.uglify()))
		// Header
		.pipe(p.header(banner, pkg))
		// Saída
		.pipe(gulp.dest(caminhos.js.destino))
		// Atualizar Navegador
		.pipe(dev(p.livereload()));

	return;
})

/*
 * Hogan
 */

//TODO: Output (Console)

gulp.task('hogan', function(event) {
	return gulp.src(caminhos.hogan.origem)
		.pipe(p.plumber())
		// Compilador
		.pipe(p.hoganPrecompile())
		//.pipe(p.defineModule('plain'))
		.pipe(p.declare({namespace: 'App.Views', noRedeclare: true}))
		// Concatena arquivos
		.pipe(p.concat('views.js'))
		// Minificador
		.pipe(prd(p.uglify()))
		// Header
		.pipe(p.header(banner, pkg))
		// Saída
		.pipe(gulp.dest(caminhos.hogan.destino))
		// Atualizar Navegador
		.pipe(dev(p.livereload()));
})

/*
 * Imagens
 */

//TODO: Kraken.io
//TODO: Sync (on Delete)
gulp.task('img', function(a,b,c) {
	return gulp.src(caminhos.img.origem)
		.pipe(p.plumber())
		// Minifica
		.pipe(p.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, verbose: true, use: [pngquant()] }))
		// Saída
		.pipe(gulp.dest(caminhos.img.destino))
		// Atualizar Navegador
		.pipe(dev(p.livereload()));
})

/*
 * Incrementa versão
 */
gulp.task('ver', function(){
	// Incrementa versão
	gulp.src('./package.json')
    .pipe(p.bump({type: 'minor'}))
    .pipe(gulp.dest('./'))
});

/*
 * Libs (JS)
 */

//TODO: Output (Console)

gulp.task('libs', function(event) {
	return gulp.src(caminhos.libs.origem)
		// Saída
		.pipe(gulp.dest(caminhos.libs.destino))
})

/*
 * Inicializa Pasta
 */

//TODO: Output (Console)

gulp.task('initDir', function(event) {
	var mkdirp = require('mkdirp');
	var globParent = require('glob-parent');

	for (let key in caminhos) {
		mkdirp(globParent(caminhos[key].origem));
	}

	return;
});

/*
 * Gera output
 */

//TODO: Output (Console)

gulp.task('dist', function(event) {
	// Limpa pasta de deploy
	gutil.log("Limpando /dist");
	rimraf('/dist/**', function (er) {
    // Seleciona arquivos
		gutil.log("Gerando /dist");
		gulp.src([
				'**/*',
				'!package.json',
				'!gulpfile.js',
				'!bower.json',
				'!**/.*',
				'!**/dev',
				'!**/dev/**',
				'!**/node_modules',
				'!**/node_modules/**',
				'!**/dist',
				'!**/dist/**'])
	    .pipe(p.using())
	    .pipe(gulp.dest(caminhos.dist.origem))
  });

	return;
})

/**
 ** Watch
 **/
gulp.task('watch', function() {
	// Iniciar LiveReload
	p.livereload.listen();

	// Iniciarlizar pastas
	gulp.start('initDir');

	// Watches
	gulp.watch(caminhos.css.origem, ['css']);
	gulp.watch(caminhos.js.origem, ['js']);
	gulp.watch(caminhos.libs.origem, ['libs']);
	gulp.watch(caminhos.hogan.origem, ['hogan']);

	// Arquivos .html/.php
	gulp.watch(['./**/*.php','./**/*.html'], (e)=>{
		gulp.src(e.path)
		.pipe(p.livereload());
		return;
	});

	// Imagens
	var imgs = gulp.watch(caminhos.img.origem);
	imgs.on('change', function(event){
		// type: deleted, changed, added, path: filename
		switch(event.type) {
			case "added":
			case "changed":
			case "renamed":
				gutil.log('Minificando ' + event.path);
				gulp.src(event.path)
					.pipe(p.plumber())
					// Minifica
					.pipe(p.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, verbose: true, use: [pngquant()] }))
					// Saída
					.pipe(gulp.dest(caminhos.img.destino))
					// Atualizar Navegador
					.pipe(dev(p.livereload()));
				break;

			case "deleted":
				console.log("del.sync");
				break;
		}
	});

});

/*
 * Preparar para deploy
 */
gulp.task('build', function(){
	// Seta Producao
	p.environments.current(prd);

	// Log
	gutil.log('Gerando Produção');

	// Tarefas
	runSequence(
		'ver',
		['css','js','libs','hogan'],
		'dist');
	// Tarefas
});


// Define a tarefa padrão
gulp.task('default', ['watch']);
