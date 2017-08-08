var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');


gulp.task('sass', function(){
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./static/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('font', function() {
  return gulp.src('./fonts/*')
    .pipe(gulp.dest('static/fonts'))
});

gulp.task('font:watch', function () {
  gulp.watch('./fonts/*', ['font']);
});

gulp.task('babel', function () {
  return gulp.src('./js/custom/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./static/js'));
});

gulp.task('babel:watch', function () {
  gulp.watch('./js/custom/**/*.js', ['babel']);
});

gulp.task('contribJS', function() {
  return gulp.src('./js/contrib/*')
    .pipe(gulp.dest('static/js'))
});

gulp.task('contribJS:watch', function() {
  gulp.watch('./js/contrib/*', ['contribJS']);
});

gulp.task('default', [ 'sass', 'babel', 'contribJS', 'font' ]);
gulp.task('watch', [ 'sass', 'babel', 'contribJS', 'font', 'sass:watch', 'babel:watch', 'contribJS:watch', 'font:watch' ]);
