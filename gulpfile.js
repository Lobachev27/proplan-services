const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const gulpIf = require("gulp-if");
const gcmq = require("gulp-group-css-media-queries");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const fileinclude = require("gulp-file-include");
const prettier = require("gulp-prettier");
const del = require("del");

const config = {
  paths: {
    scss: "./src/scss/**/*.scss",
    js: "./src/js/*.js",
    img: "./src/img/**/*.*",
    html: "./src/html/*.html",
    htmlAll: "./src/html/**/*.html",
  },
  output: {
    css: "./css/style.css",
    js: "./js/script.js",
    img: "./public/img",
    html: "./public/",
    path: "./public",
  },
  clear: {
    css: "./public/css/style.css",
    js: "./public/js/script.js",
    img: "./public/img/*.*",
    html: "./public/*.html",
  },
  isDevelop: false,
};

gulp.task("html", function () {
  return gulp
    .src(config.paths.html)
    .pipe(fileinclude({ prefix: "@@" }))
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest(config.output.html))
    .pipe(browserSync.stream());
});

gulp.task("scss", function () {
  return gulp
    .src(config.paths.scss)
    .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(concat(config.output.css))
    .pipe(autoprefixer({ overrideBrowserslist: [">0.1%"], cascade: false }))
    .pipe(gcmq())
    .pipe(gulpIf(!config.isDevelop, cleanCss({ level: 2 })))
    .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
    .pipe(gulp.dest(config.output.path))
    .pipe(browserSync.stream());
});

gulp.task("js", function () {
  return gulp
    .src(config.paths.js)
    .pipe(concat(config.output.js))
    .pipe(gulpIf(!config.isDevelop, uglify({ toplevel: false })))
    .pipe(gulp.dest(config.output.path))
    .pipe(browserSync.stream());
});

gulp.task("img", function () {
  return gulp
    .src(config.paths.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true,
      })
    )
    .pipe(gulp.dest(config.output.img))
    .pipe(browserSync.stream());
});

gulp.task("clear", function () {
  return del([
    config.clear.css,
    config.clear.js,
    config.clear.img,
    config.clear.html,
  ]);
});

gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: config.output.path,
    },
    tunnel: true,
  });

  gulp.watch(config.paths.htmlAll, gulp.parallel("html"));
  gulp.watch(config.paths.scss, gulp.series("scss"));
  gulp.watch(config.paths.js, gulp.series("js"));
  gulp.watch(config.paths.img, gulp.series("img"));
});

gulp.task(
  "build",
  gulp.series("clear", gulp.parallel("html", "scss", "js", "img"))
);
gulp.task(
  "default",
  gulp.series("clear", gulp.parallel("html", "scss", "js", "img"), "serve")
);
