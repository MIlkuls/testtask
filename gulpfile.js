const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const replace = require("gulp-replace");
const imagemin = require("gulp-imagemin");


gulp.task("server", function () {
  browserSync({
    server: {
      baseDir: "dist",
    },
  });

  gulp.watch("test_task/*.html").on("change", browserSync.reload);
});

gulp.task("replace-paths", function () {
  return gulp
    .src("test_task/index.html")
    .pipe(replace(/src="([^"]*\.png)"/g, 'src="assets/img/$1"'))
    .pipe(replace(/src="([^"]*\.jpg)"/g, 'src="assets/img/$1"'))
    .pipe(replace(/src="([^"]*\.min.js)"/g, 'src="assets/js/$1"'))
    .pipe(replace(/href="([^"]*\.min.css)"/g, 'href="assets/css/$1"'))
    .pipe(replace(/src="([^"]*\.gif)"/g, 'src="assets/icons/$1"'))
    .pipe(gulp.dest("dist"));
});

gulp.task("styles", function () {
  return gulp
    .src("test_task/*.css")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(browserSync.stream());
});

gulp.task("watch", function () {
  gulp.watch("test_task/*.css", gulp.parallel("styles"));
  gulp.watch("test_task/*.html").on("change", gulp.parallel("html"));
  gulp.watch("test_task/*.js").on("change", gulp.parallel("scripts"));
  gulp.watch("test_task/*.gif").on("change", gulp.parallel("icons"));
  gulp.watch("test_task/*.png").on("change", gulp.parallel("images"));
  gulp.watch("test_task/*.jpg").on("change", gulp.parallel("images"));
});

gulp.task("html", function () {
  return gulp
    .src("test_task/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist/"));
});

gulp.task("scripts", function () {
  return gulp
    .src("test_task/*.js")
    .pipe(gulp.dest("dist/assets/js"))
    .pipe(browserSync.stream());
});

gulp.task("icons", function () {
  return gulp
    .src("test_task/*.gif")
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
          optimizationLevel: 5,
          colors: 11,
        }),
      ])
    )
    .pipe(gulp.dest("dist/assets/icons"))
    .pipe(browserSync.stream());
});

gulp.task("images", function () {
  return gulp
    .src("test_task/*.{png,jpg}")
    .pipe(
      imagemin([
        imagemin.mozjpeg({
          quality: 50,
          optimizationLevel: 5,
          progressive: true,
        }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest("dist/assets/img"))
    .pipe(browserSync.stream());
});

gulp.task("idea", function () {
  return gulp
    .src("test_task/.idea/*.{xml,iml}")
    .pipe(gulp.dest("dist/assets/.idea"))
    .pipe(browserSync.stream());
});

gulp.task(
  "default",
  gulp.parallel(
    "watch",
    "server",
    "styles",
    "scripts",
    "html",
    "replace-paths",
    "idea",
    "images",
    "icons"
  )
);
