var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();

browserSync.init({
  server: "./"
});
browserSync.stream();

gulp.task("default", ["styles"], function() {
  gulp.watch("scss/**/*.scss", ["styles"]);
});

gulp.task("styles", function() {
  gulp
    .src("scss/**/*.scss")
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./css"));
});
