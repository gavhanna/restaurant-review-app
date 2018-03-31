var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");

gulp.task("default", function() {
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
