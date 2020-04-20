let gulp = require("gulp");
let sass = require("gulp-sass");
let autoprefixer = require("gulp-autoprefixer");
let concat = require("gulp-concat");
let uglify = require('gulp-uglify-es').default;
let csso = require('gulp-csso');
let rename = require('gulp-rename');
let header = require('gulp-header');
let path = require('path');
let reload = require('gulp-livereload');

// Constantes
const DEV_FOLDER = 'dev/';
const DEST_FOLDER = 'res/';

const banner = ['',
'/*',
"                                @",
"                             @@@",
"                ,cool:     @@@@@@@@@@@@@  @@@@@@",
"   ';;;,       ckOkkkko'    @@@  @@@  @@@@@@",
"  cxOOOko,     lkOOkkkd,    @@   @@      @@@",
" ;k0OOOOOl     'lxkkxo;    @@@   @@@@@@@ @@",
" 'dO000Ox;        ,,'",
"   ;lll:'                   @@@@@@@@@@@@ @@@@@@@ &@@@@@@",
"            ',,,'           @@  @@@  @@@*@@@@@@@ @@/  @@",
"          ,okOOOkd:        @@@  @@@  @@ @@@     @@@  @@@",
"          o0000OOOx,       @@   @@  @@@  ,@@@@  @@@  @@,",
"          ck00000Oo'            @@@",
"           ,loool:             @@@@@@ @@@@@@",
"                               @@@   @@   @@",
"                               @@@  @@@  @@@",
"                           @@@ @@@@@ @@@@@@",
'*/', ''
].join('\n');

var css = {
	src: path.join(DEV_FOLDER, 'scss/**/*.scss'),
	dest: path.join(DEST_FOLDER, 'css/'),
	filename: 'app.scss'
};

var js = {
	src: path.join(DEV_FOLDER, 'js/**/*.js'),
	dest: path.join(DEST_FOLDER, 'js/'),
	filename: 'frmnt.js'
};

var img = {
	src: path.join(DEV_FOLDER, 'img/**/*'),
	dest: path.join(DEST_FOLDER, 'img/'),
	filenames: '',
}

// #TODO: Gerar minificado no prd e normal no dev (habilitar seletor por env).
function style() {
	return (
		gulp
		.src(css.src)
		.pipe(concat(css.filename))
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(autoprefixer())
		.pipe(header(banner))
		.pipe(gulp.dest(css.dest))
		.pipe(csso())
		.pipe(rename({extname: '.min.css'}))
		.pipe(header(banner))
		.pipe(gulp.dest(css.dest))
		.pipe(reload())
		);
	}
	
	// #TODO: Gerar minificado no prd e normal no dev (habilitar seletor por env).
	function script() {
		return (
			gulp
			.src(js.src)
			.pipe(concat(js.filename))
			.pipe(gulp.dest(js.dest))
			.pipe(uglify())
			.pipe(rename({extname: '.min.js'}))
			.pipe(gulp.dest(js.dest))
			.pipe(reload())
			);
		}
		
		function images() {
			
		}

		function html() {
			return (
				gulp
				.src(['./**/*.php', './**/*.html'])
				.pipe(reload())
				);
		}
		
		function watch(){
			// Iniciar LiveReload
			reload.listen();
			
			// Watch
			gulp.watch(css.src, style);
			gulp.watch(js.src, script);
			// Arquivos .html/.php
			gulp.watch(['./**/*.php', './**/*.html']).on("change", (path, stats) => {
				gulp.src(path).pipe(reload());
			});
		}
		
		exports.css = style;
		exports.js = script;
		exports.img = images;
		
		exports.default = exports.watch = watch;