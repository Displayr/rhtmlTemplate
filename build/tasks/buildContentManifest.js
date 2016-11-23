const buildContentManifest = require('../scripts/buildContentManifest');
const gulp = require('gulp');
const gutil = require('gulp-util');

function string_src(filename, string) {
  const src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: filename,
      contents: new Buffer(string)
    }))
    this.push(null)
  }
  return src
}

gulp.task('buildContentManifest', function() {
  const contentManifest = buildContentManifest();
  return string_src("contentManifest.json", JSON.stringify(contentManifest, {}, 2))
    .pipe(gulp.dest('browser/content'))
})
