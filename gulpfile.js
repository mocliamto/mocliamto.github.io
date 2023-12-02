const gulp = require("gulp");
const livereload = require('gulp-livereload');
var deploy = require('gulp-gh-pages');

const styles = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css'
];
const scripts = [
    'node_modules/apexcharts/dist/apexcharts.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js.map',
    'node_modules/chart.js/dist/chart.umd.js',
    'node_modules/chart.js/dist/chart.umd.js.map',
    'node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js',
    'node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js',
    'node_modules/d3/dist/d3.min.js',
    'node_modules/jquery/dist/jquery.slim.min.js',
    'node_modules/jquery/dist/jquery.slim.min.map',
    'node_modules/@popperjs/core/dist/umd/popper.min.js',
    'node_modules/@popperjs/core/dist/umd/popper.js.map',
];
const fonts = [
    'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf',
    'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'
];
function copyStyles() {
    return gulp.src(styles).pipe(gulp.dest('src/assets/css/'));
}

function copyScripts() {
    return gulp.src(scripts).pipe(gulp.dest('src/assets/js/'));
}

function copyFonts() {
    return gulp.src(fonts).pipe(gulp.dest('src/assets/fonts/'));
}

gulp.task('styles', copyStyles);

gulp.task('scripts', copyScripts);

gulp.task('scripts', copyFonts);

gulp.task('default', gulp.parallel(copyStyles, copyScripts, copyFonts));

gulp.task('watch', function () {
    gulp.watch('src/**.js', () => livereload.listen());
});

gulp.task('deploy', function () {
    return gulp.src("./prod/**/*")
        .pipe(deploy({
            remoteUrl: "https://https://github.com/mocliamto/mocliamto.github.io.git",
            branch: "master"
        }))
});