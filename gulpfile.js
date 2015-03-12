var gulp = require('gulp');
var shell = require('gulp-shell');
var watch = require('gulp-watch');
var sass = require('gulp-ruby-sass');

gulp.task('build', shell.task([
  './node_modules/.bin/r.js -o build.js'
]));

gulp.task('sass', function () {
    return sass('assets/scss/main.scss', {
      style: 'compressed'
    }).pipe(gulp.dest('assets/css'));
});

gulp.task('watch', function() {
  gulp.start('build');

  watch('assets/js/src/**/*.js', function(file) {
    if(file.relative !== 'vendor/almond.js') {
      gulp.start('build');
    }
  });

  watch('assets/scss', function () {
      gulp.start('sass');
  });

});

gulp.task('default', ['build']);
