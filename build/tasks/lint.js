const gulp = require('gulp');
const gulpIf = require('gulp-if');
const eslint = require('gulp-eslint');
const cliArgs = require('yargs').argv;

const fix = !!(cliArgs.fix);

function isFixed(file) {
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint', () => {
  return gulp.src([
    '**/*.js',
    '!node_modules/**',
    '!browser/**',
    '!docs/**',
    '!examples/**',
    '!inst/**',
  ])
    .pipe(eslint({ fix }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest('.')))
    .pipe(eslint.failAfterError());
});
