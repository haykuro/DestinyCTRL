/**
 * Asset and logitics manager for Bungie's Destiny
 *
 * Copyright (c) 2015 DestinyCTRL
 *
 * Seth Benjamin <animecyc@gmail.com>
 * Arissa Brown <flipmodes01@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var spawn = require('child_process').spawn;
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var del = require('del');

gulp.task('default', ['build']);

gulp.task('build', ['clean', 'build:style', 'build:app']);

gulp.task('clean', function (cb) {
  del(['app/dist/**'], cb);
});

gulp.task('build:style', ['clean'], function () {
  return sass('app/src/scss/main.scss', {
    style: 'compressed'
  }).pipe(gulp.dest('app/dist/css'));
});

gulp.task('build:app', ['clean', 'vendor:js'], function(cb) {
  spawn('./node_modules/.bin/r.js', ['-o', 'build.js'], {
    stdio : 'inherit'
  }).on('close', function(code) {
    cb();
  });
});

gulp.task('vendor:js', ['clean'], function() {
  return gulp.src([
    'app/src/js/vendor/**/*.js',
    '!app/src/js/vendor/stapes.js'
  ]).pipe(gulp.dest('app/dist/js/vendor'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['app/src/js/!(vendor)/**/*.js'], ['build:app']);
  gulp.watch('app/src/scss/**/*.scss', ['build:style']);
});
