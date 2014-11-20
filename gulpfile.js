/*jslint node: true */

var rimraf = require('rimraf');
var gulp = require('gulp');
var p = require('gulp-load-plugins')();
var connect = p.connectMulti();

gulp.task('clean', function () {
  rimraf.sync('./build');
});

gulp.task('js', function () {
  gulp.src('./app/**/*.js')
    .pipe(p.insert.wrap('(function () {\r\n"use strict";\r\n\r\n', '\r\n})();'))
    .pipe(p.jshint())
    .pipe(p.jshint.reporter('default'))
    .pipe(p.concat('app.js'))
    .pipe(p.uglify())
    .pipe(gulp.dest('./build'));
});

gulp.task('less', function () {
  gulp.src('./app/**/*.less')
    .pipe(p.less())
    .pipe(p.autoprefixer())
    .pipe(p.concat('app.css'))
    .pipe(p.cssmin())
    .pipe(gulp.dest('./build'));
});

gulp.task('html', function () {
  gulp.src('./app/**/*.html')
    .pipe(p.htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
  gulp.watch('./app/**/*.js', ['js', 'reload']);
  gulp.watch('./app/**/*.less', ['less', 'reload']);
  gulp.watch('./app/**/*.html', ['html', 'reload']);
});

gulp.task('connect', connect.server({
  root: ['./build'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome'
  }
}));

gulp.task('reload', function () {
  gulp.src('./app/index.html')
    .pipe(connect.reload());
});

gulp.task('default', ['clean', 'html', 'js', 'less']);
gulp.task('server', ['watch', 'default', 'connect']);
