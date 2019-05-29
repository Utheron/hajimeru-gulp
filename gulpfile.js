// #####################################################################
// # ENABLE .ENV FILE SUPPORT
// #####################################################################
require('dotenv').config();

// #####################################################################
// # REQUIRE GULP
// #####################################################################
const { src, dest, task, watch, series, parallel } = require('gulp');

// #####################################################################
// # STYLES RELATED
// #####################################################################
const sass              = require('gulp-sass');
const autoprefixer      = require('gulp-autoprefixer');

// #####################################################################
// # JAVASCRIPT RELATED
// #####################################################################
const uglify            = require("gulp-uglify");
const babelify          = require("babelify");
const browserify        = require("browserify");
const source            = require("vinyl-source-stream");
const buffer            = require("vinyl-buffer");

// #####################################################################
// # UTILITIES
// #####################################################################
const rename            = require('gulp-rename');
const sourcemaps        = require('gulp-sourcemaps');
const plumber           = require('gulp-plumber');

// #####################################################################
// # PICTURES RELATED
// #####################################################################
const cache             = require('gulp-cache');
const imagemin          = require('gulp-imagemin');
const imageminPngquant  = require('imagemin-pngquant');
const imageminMozjpeg   = require('imagemin-mozjpeg');
const imageminGiflossy  = require('imagemin-giflossy');

// #####################################################################
// # BROWSER RELATED
// #####################################################################
const browserSync       = require('browser-sync').create();

// #####################################################################
// # PROJECT RELATED
// #####################################################################
const siteUrl           = process.env.SITE_URL;
const externalUrl       = process.env.EXTERNAL_URL;
const assetsUrl         = process.env.DIST;

const styleSRC          = [ process.env.SRC + 'scss/style.scss' ]
const styleWatch        = process.env.SRC + 'scss/**/*.scss';

const scriptSRC         = 'script.js';
const scriptFolder      = process.env.SRC + 'js/';
const scriptWatch       = process.env.SRC + 'js/**/*.js';
const scriptFiles       = [scriptSRC];

const imageSRC          = process.env.SRC + 'img/*';

const phpFiles          = '**/*.php';

// #####################################################################
// # FUNCTIONS
// #####################################################################
function browser_sync(done) {
    browserSync.init({
        open: false,
        proxy: siteUrl,
        host: externalUrl,
        port: 3000,
        notify: false
    });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

function styles(done) {
    src(styleSRC, {allowEmpty: true})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true, outputStyle: 'compressed'}))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({browsers: ['last 2 versions', '> 5%', 'Firefox ESR']}))
        .pipe(rename({extname: '.min.css'}))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(assetsUrl + 'css'))
        .pipe(browserSync.stream());
    done();
}

function scripts(done) {
    scriptFiles.map( function( entry ) {
        return browserify({entries: [scriptFolder + entry]})
            .transform(babelify, {presets: ['@babel/preset-env']})
            .bundle()
            .pipe(source(entry))
            .pipe(rename({extname: '.min.js'}))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(dest(assetsUrl + 'js'))
            .pipe(browserSync.stream());
    });
    done();
}

function compress_img() {
    return src(imageSRC)
        .pipe(cache(imagemin([
            imageminPngquant({speed: 1, quality: 98}),
            imageminGiflossy({optimizationLevel: 3, optimize: 3, lossy: 2}),
            imagemin.svgo({plugins: [{ removeViewBox: false }]}),
            imagemin.jpegtran({ progressive: true }),
            imageminMozjpeg({ quality: 70 })
        ])))
        .pipe(dest(assetsUrl + 'img'));
}

function watch_files() {
    watch(styleWatch, series(styles, reload));
    watch(scriptWatch, series(scripts, reload));
    watch(phpFiles, reload);
}

// #####################################################################
// # GULP TASKS
// #####################################################################
task('default', parallel(styles, scripts));
task('watch', parallel(browser_sync, watch_files));
task('imagemin', parallel(compress_img));