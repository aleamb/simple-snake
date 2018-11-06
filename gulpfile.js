const gulp = require('gulp');
const browserSync = require('browser-sync');

var browserSyncTask = function bs() {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'snake.html',
    },
  });
};

var watch = gulp.series(browserSyncTask);

module.exports = { watch: watch }
