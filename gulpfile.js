/* jshint node: true, module:true */
'use strict';
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var notify = require("gulp-notify");
var browserSync = require('browser-sync').create();
// styling
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');

// JS
var minify = require('gulp-minify');
var concat = require('gulp-concat');


const CLIENT_PATH = 'client';

gulp.task('sass', function () {
    console.log('SASSS');
    return gulp.src(CLIENT_PATH+'/src/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concatCss("style.css"))
        .pipe(gulp.dest(CLIENT_PATH+'/dist/css'));
});

gulp.task('sass:watch', function () {
    console.log('SASS watch');
    gulp.watch(CLIENT_PATH+'/src/sass/**/*.sass', ['sass']);
});

gulp.task('js:watch', function () {
    console.log('JS watch');
    gulp.watch(CLIENT_PATH+'/src/js/**/*.js', ['compress']);
});

gulp.task('compress', function() {
    console.log('\ncompress\n\n');
    gulp.src(CLIENT_PATH+'/src/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest(CLIENT_PATH+'/dist/js'))
});

gulp.task('server', function (cb) {
    console.log('server start');
    var called = false;
    notify("server started!");
    nodemon({
        script: 'server/server.js',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' }
    }).on('start', function () {
        if (!called) {
            called = true;
            cb();
        }
    });
});

gulp.task('browser-sync', ['server'], function() {
    browserSync.init({
        proxy: "http://localhost:3000",
        port: 5000,
        notify: true
    });
    gulp.watch(CLIENT_PATH+"/dist/css/*.css").on('change', browserSync.reload);
    gulp.watch(CLIENT_PATH+"/dist/js/*.js").on('change', browserSync.reload);
});



gulp.task('default', ['sass:watch',
    'js:watch', // add files to /dist after edit
    'browser-sync'], function() {

    // run those tasks at start
    gulp.run('sass');
    gulp.run('compress');
});