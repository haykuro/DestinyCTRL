var spawn = require('child_process').spawn;
var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');

gulp.task('build', [
  'build:style',
  'build:app'
]);

gulp.task('build:style', function () {
  return sass('app/src/scss/main.scss', {
    style: 'compressed'
  }).pipe(gulp.dest('app/dist/css'));
});

gulp.task('build:app', ['vendor:js'], function(done) {
  spawn('./node_modules/.bin/r.js', ['-o', 'build.js'], {
    stdio : 'inherit'
  }).on('close', function(code) {
    done();
  });
});

gulp.task('vendor:js', function() {
  return gulp.src([
    'app/src/js/vendor/**/*.js',
    '!app/src/js/vendor/stapes.js'
  ]).pipe(gulp.dest('app/dist/js/vendor'));
});

gulp.task('watch', ['build'], function() {
  watch('app/src/js/**/*.js', function(file) {
    if(file.relative !== 'vendor/almond.js') {
      gulp.start('build:app');
    }
  });

  watch('app/src/scss/**/*.scss', function () {
      gulp.start('build:style');
  });
});
