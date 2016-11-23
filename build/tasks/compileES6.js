var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('compileES6', function () {

  return gulp.src('theSrc/scripts/**/*.js', {read: false}) // no need of reading file because browserify does.

    // transform file objects using gulp-tap plugin
    .pipe(tap(function (file) {

      gutil.log('bundling ' + file.path);

      // replace file contents with browserify's bundle stream
      file.contents = browserify(file.path, {debug: true})
        .transform(babelify, { presets: ['es2015'] })
        .bundle();
    }))

    // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
    .pipe(buffer())

    // load and init sourcemaps
    // .pipe(sourcemaps.init({loadMaps: true}))

    // .pipe(uglify())

    // write sourcemaps
    // .pipe(sourcemaps.write('./'))

    .pipe(gulp.dest('browser/scripts/'))
    .pipe(gulp.dest('inst/htmlwidgets/'));

});
