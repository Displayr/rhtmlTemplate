const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('copy', function () {
  gulp.src([
    'theSrc/internal_www/**/*',
    '!theSrc/internal_www/**/*.js',
  ], {}).pipe(gulp.dest('browser'));

  gulp.src([
    'theSrc/images/**/*',
  ], {}).pipe(gulp.dest('browser/images'));

  gulp.src('theSrc/R/htmlwidget.yaml')
    .pipe(rename(`${gulp.context.widgetName}.yaml`))
    .pipe(gulp.dest('inst/htmlwidgets/'));

  gulp.src('theSrc/R/htmlwidget.R')
    .pipe(rename(`${gulp.context.widgetName}.R`))
    .pipe(gulp.dest('R/'));

  // only used directly in browser by renderExample.html
  const extLibs = [
    'node_modules/lodash/lodash.min.js',
    'node_modules/jquery/dist/jquery.min.js',
  ];

  gulp.src(extLibs)
    .pipe(gulp.dest('browser/internal_www/external/'));
});
