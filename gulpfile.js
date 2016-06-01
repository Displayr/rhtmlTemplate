'use strict';

// TEMPLATE! - this widgetName needs to be updated to match your widget
var widgetName = 'rhtmlTemplate';

var _ = require('lodash');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var Promise = require('bluebird');
var fs =Promise.promisifyAll(require('fs-extra'));

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('build', function(done) {
  var runSequence = require('run-sequence');
  runSequence('clean', 'test', 'core', ['makeDocs', 'makeExample'], done);
});

gulp.task('core', ['compile-coffee', 'less', 'copy']);

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

gulp.task('clean', function(done) {
  var locationsToDelete = ['browser', 'inst', 'man', 'R', 'examples'];
  var deletePromises = locationsToDelete.map( function(location) { return fs.removeAsync(location); })
  Promise.all(deletePromises).then(function() { done() });
});

gulp.task('makeDocs', ['core'], function () {
  var shell = require('gulp-shell');
  return gulp.src('./build/makeDoc.r', {read: false})
    .pipe(shell([
      'r --no-save 2>/dev/null >/dev/null < <%= file.path %>',
    ], {}))
});

gulp.task('makeExample', ['core'], function (done) {
  var generateR = require('./build/generateExamplesInR.js');
  fs.mkdirpAsync('examples')
    .then(function () { return fs.readFileAsync('theSrc/features/features.json', { encoding: 'utf8' }) })
    .then(JSON.parse)
    .then(generateR)
    .then(function (content) { return fs.writeFileAsync('examples/features.R', content, { encoding: 'utf8' }) })
    .catch( function(err) { console.log("makeExample error: " + err)})
    .then(done);
})

gulp.task('test', function (done) {
  var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('less', function () {
  var less = require('gulp-less');
  return gulp.src('theSrc/styles/**/*.less')
    .pipe(less({}))
    .pipe(gulp.dest('browser/styles'))
    .pipe(gulp.dest('inst/htmlwidgets/lib/style'));
});

gulp.task('compile-coffee', function () {
  var gulp_coffee = require("gulp-coffee");

  gulp.src('theSrc/scripts/**/*.coffee')
    .pipe(gulp_coffee({ bare: true, header: true }))
    .pipe(gulp.dest('browser/scripts'))
    .pipe(gulp.dest('inst/htmlwidgets/'));
});

gulp.task('copy', function () {
  gulp.src([
    'theSrc/**/*.html'
  ], {}).pipe(gulp.dest('browser'));

  gulp.src([
    'theSrc/images/**/*'
  ], {}).pipe(gulp.dest('browser/images'));

  gulp.src([
    'theSrc/features/*.json'
  ], {}).pipe(gulp.dest('browser/features'));

  var rename = require('gulp-rename');
  gulp.src('theSrc/R/htmlwidget.yaml')
    .pipe(rename(widgetName + '.yaml'))
    .pipe(gulp.dest('inst/htmlwidgets/'));

  gulp.src('theSrc/R/htmlwidget.R')
    .pipe(rename(widgetName + '.R'))
    .pipe(gulp.dest('R/'));

  // TEMPLATE! - this list of dependencies in the ./build/externalLibs.json file may need to be updated to match your widget
  gulp.src(require('./build/externalLibs.json'))
    .pipe(gulp.dest('inst/htmlwidgets/lib/'))
    .pipe(gulp.dest('browser/external/'))

});

gulp.task('connect', ['core'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('browser'))
    .use(serveIndex('browser'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes in the browser directory and reload chrome on changes
  gulp.watch([
    'browser/**/*',
  ]).on('change', $.livereload.changed);

  // when these files change then do this,
  // for example when the json file changes rerun the copy command
  gulp.watch('theSrc/**/*.json', ['copy']);
  gulp.watch('theSrc/**/*.html', ['copy']);
  gulp.watch('theSrc/images/**/*', ['copy']);
  gulp.watch('theSrc/styles/**/*.less', ['less']);
  gulp.watch('theSrc/scripts/**/*.coffee', ['compile-coffee']);
});
