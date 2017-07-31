var gulp = require('gulp');
var browserSync = require('browser-sync');


gulp.task('watch', ['browser-sync'], function() {});


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
	    index: "snake.html"
        }
    });
});
