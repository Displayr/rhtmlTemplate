const Promise = require('bluebird');
const gulp = require('gulp');

const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));
const opn = require('opn');
const runSequence = require('run-sequence');
const widgetConfig = require('./build/config/widget.config.json');

if (!_.has(gulp, 'context')) {
  gulp.context = {
    widgetName: widgetConfig.widgetName,
  };
} else {
  console.error('Unexpected build failure. gulp already has a context.');
  process.exit(1);
}

fs.readdirSync('./build/tasks').filter(function (file) {
  return (/\.js$/i).test(file);
}).map(function (file) {
  /* eslint-disable global-require */
  return require(`./build/tasks/${file}`);
  /* eslint-enable global-require */
});

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('build', function (done) {
  runSequence('clean', ['core', 'lint'], ['testSpecs', 'makeDocs', 'makeExample'], done);
});

gulp.task('core', ['compileES6ToInst', 'less', 'copy', 'buildContentManifest']);

gulp.task('serve', ['core', 'compileInternalWeb', 'buildSnapshotsFeatureFile', 'connect', 'watch'], function () {
  opn('http://localhost:9000');
});

gulp.task('testVisual', function (done) {
  runSequence(['core', 'webdriverUpdate'], ['connect', 'buildSnapshotsFeatureFile'], 'runProtractor', done);
});

// NB p_skip skips the webdriver download step - it is downloading gecko drivers every time (30MB / run)
// TODO - need to detect which browser drivers are required - probavbly in protractor conf
gulp.task('testVisual_s', ['runProtractor']);
