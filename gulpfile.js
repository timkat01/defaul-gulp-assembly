const gulp =  require('gulp'); // Подключаю Gulp
const browserSync = require('browser-sync').create(); // Подключаю browserSync
const watch = require('gulp-watch'); // Слежение за файлами
const sass = require('gulp-sass')(require('sass')); // Компилятор из SCSS в CSS
const autoprefixer = require('gulp-autoprefixer'); // Добовляет браузерные префиксы
const sourcemaps = require('gulp-sourcemaps'); // Показывает в инспекторе в каком scss файле строка
const notify = require('gulp-notify'); // Показывает уведомления
const plumber = require('gulp-plumber'); // Делает обработку ошибок
const gcmq = require('gulp-group-css-media-queries'); // Отделяет @Media в CSS файле
const sassGlob = require('gulp-sass-glob');
const fileinclude = require('gulp-file-include'); // Сборка HTML из шаблонов

// Таск для сборки HTML из шаблонов
gulp.task('html', function(callback) {
	return gulp.src('./app/html/*.html')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'HTML include',
					sound: 'false',
					message: err.message
				}
			})
		}) )
		.pipe( fileinclude({ prefix: '@@'}))
		.pipe ( gulp.dest('./app/') )
	callback();
});

// Таск для компиляции SCSS в CSS
gulp.task('scss', function(callback) {
	return gulp.src('./app/scss/main.scss')

		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					sound: 'false',
					message: err.message
				}
			})
		}) )
		.pipe( sourcemaps.init() )
		.pipe(sassGlob())
		.pipe( 
			sass({
			indentType: 'tab',
			indentWidth: 1,
			outputStyle: 'expanded'
		}) )
		.pipe(gcmq())
		.pipe( autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest('./app/css/') )
		callback();
});

// Слежение за HTML и CSS и обновление браузера
gulp.task('watch', function () {
	// Слежение за  HTML/CSS и обновление браузера
	watch(['./app/*.html', './app/css/**/*.css'], gulp.parallel( browserSync.reload ));
	// Слежение за SCSS и компиляция в CSS
	watch('./app/scss/**/*.scss', gulp.parallel('scss'));
	//Слежение за HTML и сборка страниц и шаблонов
	watch('./app/html/**/*.html', gulp.parallel('html'))
});

// Задача для старта сервера из папки app
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./app/"
        }
    })
});


// Дефолтный таск (задача по умолчанию)
// Запускаем одновременно задачи server и watch
gulp.task('default', gulp.parallel('server', 'watch', 'scss', 'html'));