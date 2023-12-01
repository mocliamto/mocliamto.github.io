const gulp = require("gulp");

const styles = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
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

function copyStyles(){
    return gulp.src(styles).pipe(gulp.dest('src/assets/css/'));
}

function copyScripts(){
    return gulp.src(scripts).pipe(gulp.dest('src/assets/js/'));
}

gulp.task('styles', copyStyles);

gulp.task('scripts', copyScripts);

gulp.task('all', gulp.parallel(copyStyles, copyScripts));