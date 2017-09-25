var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');


gulp.task('sass', function(){
  return gulp.src('./assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

gulp.task('font', function() {
  return gulp.src('./assets/fonts/*')
    .pipe(gulp.dest('./public/fonts'))
});

gulp.task('font:watch', function () {
  gulp.watch('./assets/fonts/*', ['font']);
});

gulp.task('babel', function () {
  return gulp.src('./assets/js/custom/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('babel:watch', function () {
  gulp.watch('./assets/js/custom/**/*.js', ['babel']);
});

gulp.task('contribJS', function() {
  return gulp.src('./assets/js/contrib/*')
    .pipe(gulp.dest('./public/js'))
});

gulp.task('contribJS:watch', function() {
  gulp.watch('./assets/js/contrib/*', ['contribJS']);
});

gulp.task('default', [ 'sass', 'babel', 'contribJS', 'font' ]);
gulp.task('watch', [ 'sass', 'babel', 'contribJS', 'font', 'sass:watch', 'babel:watch', 'contribJS:watch', 'font:watch' ]);
