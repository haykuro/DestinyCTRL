var gulp = require('gulp');
var shell = require('gulp-shell');
var watch = require('gulp-watch');

gulp.task('build', shell.task(['r.js -o build.js']));

gulp.task('watch', function() {
  gulp.start('build');

  watch('assets/js/src/**/*.js', function(file) {
    if(file.relative !== 'vendor/almond.js') {
      gulp.start('build');
    }
  });
})

gulp.task('default', ['build']);
