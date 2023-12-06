const gulp = require('gulp');
const livereload = require('gulp-livereload');
const deploy = require('gulp-gh-pages');
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');

const faviconData = 'faviconData.json';

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
    'node_modules/@popperjs/core/dist/umd/popper.min.js',
    'node_modules/@popperjs/core/dist/umd/popper.js.map',
    'node_modules/prismjs/components/prism-core.min.js',
    'node_modules/prismjs/components/prism-clike.min.js',
    'node_modules/prismjs/components/prism-javascript.min.js',
    'node_modules/prismjs/plugins/file-highlight/prism-file-highlight.min.js',
    'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js',
    'node_modules/prismjs/plugins/match-braces/prism-match-braces.min.js',
    'node_modules/marked/lib/marked.umd.js',
    'node_modules/marked/lib/marked.umd.js.map'
];
const fonts = [
    'node_modules/@fortawesome/fontawesome-free/webfonts/*',
    'node_modules/@fontsource/roboto/files/roboto-latin-300-normal.*'
];
function copyStyles() {
    return gulp.src(styles, { 'base': 'node_modules/' }).pipe(gulp.dest('src/assets/css/'));
}

function copyScripts() {
    return gulp.src(scripts, { 'base': 'node_modules/' }).pipe(gulp.dest('src/assets/js/'));
}

function copyFonts() {
    return gulp.src(fonts, { 'base': 'node_modules/' }).pipe(gulp.dest('src/assets/css/'));
}

gulp.task('styles', copyStyles);

gulp.task('scripts', copyScripts);

gulp.task('fonts', copyFonts);

gulp.task('default', gulp.parallel(copyStyles, copyScripts, copyFonts));

gulp.task('watch', function () {
    gulp.watch('src/**.js', () => livereload.listen());
});

gulp.task('deploy', function () {
    return gulp.src('./prod/**/*')
        .pipe(deploy({
            remoteUrl: 'https://github.com/mocliamto/mocliamto.github.io.git',
            branch: 'master'
        }))
});

gulp.task('generate-favicon', function (done) {
    realFavicon.generateFavicon({
        masterPicture: 'node_modules/@fortawesome/fontawesome-free/svgs/solid/chart-line.svg',
        dest: './src/assets/favicons/',
        iconsPath: '/src/assets/favicons/',
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
        markupFile: faviconData
    }, function () {
        done();
    });
});

gulp.task('inject-favicon-markups', function () {
    return gulp.src(['src/index.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(faviconData)).favicon.html_code))
        .pipe(gulp.dest('./src/'));
});

gulp.task('check-for-favicon-update', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(faviconData)).version;
    realFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
    });
});