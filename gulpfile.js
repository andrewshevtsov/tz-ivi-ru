'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('css', function () {
  return gulp.src('source/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemaps.write( './' ))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('compress', function () {
  return gulp.src('build/css/style.css')
    .pipe(rename('style.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('build/css'))
});

gulp.task('scripts', function () {
  return gulp.src([
    'source/scripts/jQuery3.3.1.js',
    'source/scripts/jquery.dotdotdot.js'
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/scripts'))
  .pipe(gulp.src('source/scripts/main.js'))
  .pipe(uglify())
  .pipe(rename('main.min.js'))
  .pipe(gulp.dest('build/scripts'))
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css', 'refresh'));
  gulp.watch('source/*.html', gulp.series('refresh'));
  gulp.watch('source/scripts/**/*.js', gulp.series('refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('copy', function () {
   return gulp.src([
  'source/fonts/**/*.otf',
  'source/img/**',
  'source/*.html'
  // 'source/scripts/**/*.js'
   ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series('clean', 'copy', 'css', 'scripts', 'compress'));
gulp.task('start', gulp.series('clean', 'copy', 'css', 'scripts', 'server'));
