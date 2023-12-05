const gulp = require("gulp");
const livereload = require('gulp-livereload');
const deploy = require('gulp-gh-pages');
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');

const FAVICON_DATA_FILE = 'faviconData.json';

const styles = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    'node_modules/prismjs/themes/prism.min.css',
    'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.css',
    'node_modules/prismjs/plugins/match-braces/prism-match-braces.min.css'
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
    'node_modules/prismjs/components/*.js',
    'node_modules/prismjs/plugins/file-highlight/prism-file-highlight.min.js',
    'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js',
    'node_modules/prismjs/plugins/match-braces/prism-match-braces.min.js',
    'node_modules/prismjs/plugins/autoloader/prism-autoloader.min.js'
];
const fonts = [
    'node_modules/@fortawesome/fontawesome-free/webfonts/*'
];
function copyStyles() {
    return gulp.src(styles).pipe(gulp.dest('src/assets/css/'));
}

function copyScripts() {
    return gulp.src(scripts, { "base": "node_modules/" }).pipe(gulp.dest('src/assets/js/'));
}

function copyFonts() {
    return gulp.src(fonts).pipe(gulp.dest('src/assets/webfonts/'));
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

gulp.task('generate-favicon', function (done) {
    realFavicon.generateFavicon({
        masterPicture: 'node_modules/@fortawesome/fontawesome-free/svgs/solid/chart-line.svg',
        dest: './',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {
                design: 'raw'
            },
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#5bbad5'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: false,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function () {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function () {
    return gulp.src(['index.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('./'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
    });
});