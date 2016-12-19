/* jshint node: true, module:true */
'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var nodemon = require('gulp-nodemon');
var notify = require("gulp-notify");
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');

const CLIENT_SRC = './client';

gulp.task('sass', function () {
    return gulp.src(CLIENT_SRC+'/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(CLIENT_SRC+'/css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concatCss("style.css"))
        .pipe(gulp.dest(CLIENT_SRC+'/css'));
});

gulp.task('sass:watch', function () {
    console.log('SASS watch');
    gulp.watch(CLIENT_SRC+'/sass/**/*.sass', ['sass']);
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
    gulp.watch(CLIENT_SRC+"/css/*.css").on('change', browserSync.reload);
});



gulp.task('default', ['sass:watch', 'browser-sync'], function() {
    gulp.task('sass:watch');
});