import gulp from 'gulp';
import mocha from 'gulp-mocha';
import watch from 'gulp-watch';
import batch from 'gulp-batch';

gulp.task('test', function () {
    return gulp.src('src/**/*.spec.js', { read: false })
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', ['default'], function () {
    watch(['src/**/*.js', 'gulpfile.babel.js'], batch((events, done) => {
        gulp.start('test', done);
    }));
});

gulp.task('default', ['test']);
