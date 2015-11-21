// Módulos (Requires)
var gulp = require('gulp')
var gutil = require('gulp-util');
var p = require('gulp-load-plugins')();

// //// Utilitários
var path = require('path')
var pngquant = require('imagemin-pngquant')
var del = require('del');

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

// Incrementa versão
if(prd()) {
	gulp.src('./package.json')
    .pipe(p.bump({type: 'minor'}))
    .pipe(gulp.dest('./'))
}

// Configurações do Package (projeto)
pkg = require('./package.json')

/*
 * Configurações
 */

//TODO: Kraken API Key/Switch

// Seta os caminhos padrão
caminhos = {
	"css": {
		"origem": path.join(PASTA_DEV, 'scss/**/*.scss'),
		"destino": path.join(PASTA_DEST, 'css/')
	},

	"js": {
		"origem": path.join(PASTA_DEV, 'js/**/*.js'),
		"destino": path.join(PASTA_DEST, 'app/')
	},

	"img": {
		"origem": path.join(PASTA_DEV, 'img/**/*'),
		"destino": path.join(PASTA_DEST, 'img/')
	},

	"libs": {
		"origem": path.join(PASTA_DEV, 'lib/**/*.!(md|txt|html|json)'),
		"destino": path.join(PASTA_DEST, 'lib/')
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
		.pipe(p.plumber())
		// Pré-processamento
		.pipe(p.sass())
		.pipe(p.pleeease({"minifier": prd(), "autoprefixer": {browsers: ['last 2 versions', 'ie 9', '> 1%']}}))
		.pipe(prd(p.csso))
		// Cabeçalho
		.pipe(p.header(banner, pkg))
		// Minificar e otimizar
		.pipe(p.rename({extname: ".min.css"}))
		.pipe(prd(p.size))
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
})

/*
 * Imagens
 */

//TODO: Kraken.io
//TODO: Minify
//TODO: Sync (on Delete)
gulp.task('img', function(a,b,c) {
	// return gulp.src(caminhos.img.origem)
	// 	.pipe(p.plumber())
	// 	// Minifica
	// 	.pipe(p.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, verbose: true, use: [pngquant()] }))
	// 	// Saída
	// 	.pipe(gulp.dest(caminhos.img.destino))
	// 	// Atualizar Navegador
	// 	.pipe(dev(p.livereload()));
})

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
 * Funções Auxiliares
 */

/**
 ** Core
 **/
gulp.task('watch', function() {
	// Iniciar LiveReload
	p.livereload.listen();

	// Watches
	gulp.watch(caminhos.css.origem, ['css']);
	gulp.watch(caminhos.js.origem, ['js']);
	gulp.watch(caminhos.libs.origem, ['libs']);

	// Imagens
	var imgs = gulp.watch(caminhos.img.origem);
	imgs.on('change', function(event){
		// type: deleted, changed, added, path: filename
		switch(event.type) {
			case "added":
			case "changed":
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

// Define a tarefa padrão
gulp.task('default', ['watch']);
