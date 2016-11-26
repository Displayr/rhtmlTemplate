const gulp = require('gulp');

gulp.task('makeExample', ['core'], function () {
  var shell = require('gulp-shell');
  // TODO this should be in build/helpers
  return gulp.src('./build/scripts/convertContentToExamplesInR.js', {read: false})
    .pipe(shell([
      'node <%= file.path %>',
    ], {}));
})
