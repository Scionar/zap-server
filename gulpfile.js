const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');


gulp.task('sass', () => gulp.src('./assets/sass/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./public/css')));

gulp.task('sass:watch', () => {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

gulp.task('font', () => gulp.src('./assets/fonts/*')
  .pipe(gulp.dest('./public/fonts')));

gulp.task('font:watch', () => {
  gulp.watch('./assets/fonts/*', ['font']);
});

gulp.task('babel', () => gulp.src('./assets/js/custom/**/*.js')
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(gulp.dest('./public/js')));

gulp.task('babel:watch', () => {
  gulp.watch('./assets/js/custom/**/*.js', ['babel']);
});

gulp.task('contribJS', () => gulp.src('./assets/js/contrib/*')
  .pipe(gulp.dest('./public/js')));

gulp.task('contribJS:watch', () => {
  gulp.watch('./assets/js/contrib/*', ['contribJS']);
});

gulp.task('default', ['sass', 'babel', 'contribJS', 'font']);
gulp.task('watch', ['sass', 'babel', 'contribJS', 'font', 'sass:watch', 'babel:watch', 'contribJS:watch', 'font:watch']);
